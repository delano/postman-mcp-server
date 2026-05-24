import axios, { AxiosInstance } from 'axios';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { ToolDefinition, ToolResource } from '../../types/index.js';
import https from 'https';

interface PostmanToolOptions {
  baseURL?: string;
  acceptHeader?: string;
}

type ToolMapping = { [key: string]: any };

/**
 * Base class for Postman API tools
 * Provides common functionality and HTTP client setup
 */
export class BasePostmanTool {
  /**
   * Protected HTTP client for making API requests
   * All derived classes should use this for Postman API calls
   */
  protected readonly client: AxiosInstance;

  constructor(
    apiKey: string | null,
    options: PostmanToolOptions = {},
    existingClient?: AxiosInstance
  ) {
    const baseURL = options.baseURL || 'https://api.getpostman.com';

    if (existingClient) {
      this.client = existingClient;
    } else {
      // Create new client with API key
      if (!apiKey) {
        throw new Error('API key is required when not providing an existing client');
      }

      this.client = axios.create({
        baseURL,
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 30000, // 30 seconds timeout
        httpsAgent: new https.Agent({
          rejectUnauthorized: false // Disable SSL verification for corporate proxy
        })
      });
    }

    // Add request interceptor for logging
    this.client.interceptors.request.use(config => {
      console.log('Making request to:', config.url);
      return config;
    });

    // Add custom Accept header if provided
    if (options.acceptHeader) {
      this.client.interceptors.request.use(config => {
        config.headers['Accept'] = options.acceptHeader;
        return config;
      });
    }

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('Axios error:', error.code, error.message);
        if (error.response) {
          // Map HTTP status codes to appropriate MCP error codes
          switch (error.response.status) {
            case 400:
              throw new McpError(
                ErrorCode.InvalidRequest,
                error.response.data?.error?.message || 'Invalid request parameters'
              );
            case 401:
              throw new McpError(
                ErrorCode.InvalidRequest,
                'Unauthorized: Invalid or missing API key'
              );
            case 403:
              throw new McpError(
                ErrorCode.InvalidRequest,
                'Forbidden: Insufficient permissions or feature unavailable'
              );
            case 404:
              throw new McpError(
                ErrorCode.InvalidRequest,
                'Resource not found'
              );
            case 422:
              throw new McpError(
                ErrorCode.InvalidRequest,
                error.response.data?.error?.message || 'Invalid request parameters'
              );
            case 429:
              throw new McpError(
                ErrorCode.InvalidRequest,
                'Rate limit exceeded'
              );
            default:
              throw new McpError(
                ErrorCode.InternalError,
                error.response.data?.error?.message || 'Internal server error'
              );
          }
        } else if (error.request) {
          throw new McpError(
            ErrorCode.InternalError,
            'No response received from Postman API'
          );
        } else {
          throw new McpError(
            ErrorCode.InternalError,
            `Error making request: ${error.message}`
          );
        }
      }
    );
  }

  /**
   * Generate tool mappings from tool definitions
   * Each derived class should implement getToolDefinitions() to provide its specific tools
   * @returns Object mapping tool names to the tool handler instance
   */
  public getToolMappings(): ToolMapping {
    const toolDefinitions = this.getToolDefinitions();
    const mappings: ToolMapping = {};

    toolDefinitions.forEach(tool => {
      mappings[tool.name] = this;
    });

    return mappings;
  }

  /**
   * Get tool definitions for this tool class
   * Must be implemented by derived classes
   */
  public getToolDefinitions(): ToolDefinition[] {
    throw new Error('getToolDefinitions() must be implemented by derived class');
  }

  /**
   * List resources that this tool can interact with
   * Should be implemented by derived classes that handle resources
   */
  public async listToolResources(): Promise<ToolResource[]> {
    return [];
  }

  /**
   * Get details about how this tool can interact with a specific resource
   * Should be implemented by derived classes that handle resources
   * @throws {McpError} If the resource cannot be handled by this tool
   */
  public async getToolResourceDetails(resourceUri: string): Promise<ToolResource> {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Resource ${resourceUri} cannot be handled by this tool`
    );
  }

  /**
   * Check if this tool can handle a specific resource
   */
  public async canHandleResource(resourceUri: string): Promise<boolean> {
    try {
      await this.getToolResourceDetails(resourceUri);
      return true;
    } catch (error) {
      return false;
    }
  }
}
