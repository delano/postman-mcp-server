#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosError } from 'axios';
import {
  WorkspaceTools,
  EnvironmentTools,
  CollectionTools,
  UserTools,
  ApiTools,
  AuthTools,
  MockTools,
  MonitorTools,
  AdditionalFeatureTools,
  SdkTools
} from './tools/index.js';
import { ToolDefinition, ToolHandler } from './types/index.js';
import {
  McpResourceHandler,
  ResourceTemplateHandler,
  PromptHandler,
  ToolHandler as ToolRequestHandler
} from './handlers/index.js';

const API_KEY = process.env.POSTMAN_API_KEY;
if (!API_KEY) {
  throw new Error('POSTMAN_API_KEY environment variable is required');
}

// Constants for configuration
const CONFIG = {
  SERVER_NAME: 'postman-api-server',
  VERSION: '0.2.0',
  API_BASE_URL: 'https://api.getpostman.com',
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
} as const;

export class PostmanAPIServer {
  private server: Server;
  private axiosInstance;
  private workspaceTools: WorkspaceTools;
  private environmentTools: EnvironmentTools;
  private collectionTools: CollectionTools;
  private userTools: UserTools;
  private apiTools: ApiTools;
  private authTools: AuthTools;
  private mockTools: MockTools;
  private monitorTools: MonitorTools;
  private additionalFeatureTools: AdditionalFeatureTools;
  private sdkTools: SdkTools;
  private toolDefinitions: ToolDefinition[];
  private toolHandlers: Map<string, ToolHandler>;
  private isShuttingDown: boolean;

  constructor() {
    this.isShuttingDown = false;

    this.server = new Server(
      {
        name: CONFIG.SERVER_NAME,
        version: CONFIG.VERSION,
      },
      {
        capabilities: {
          tools: {
            resources: true  // Enable tool resources capability
          },
          resources: {},
          prompts: {},
        },
      }
    );

    this.axiosInstance = axios.create({
      baseURL: CONFIG.API_BASE_URL,
      headers: {
        'X-Api-Key': API_KEY,
        'User-Agent': `${CONFIG.SERVER_NAME}/${CONFIG.VERSION}`,
      },
      timeout: CONFIG.REQUEST_TIMEOUT,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response) {
          // API responded with error status
          throw new McpError(
            ErrorCode.InternalError,
            `Postman API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
          );
        } else if (error.request) {
          // Request made but no response received
          throw new McpError(
            ErrorCode.InternalError,
            'No response received from Postman API'
          );
        } else {
          // Error in request setup
          throw new McpError(
            ErrorCode.InternalError,
            `Request setup error: ${error.message}`
          );
        }
      }
    );

    // Initialize all properties explicitly
    this.workspaceTools = new WorkspaceTools(this.axiosInstance);
    this.environmentTools = new EnvironmentTools(this.axiosInstance);
    this.collectionTools = new CollectionTools(this.axiosInstance);
    this.userTools = new UserTools(this.axiosInstance);
    this.apiTools = new ApiTools(this.axiosInstance);
    this.authTools = new AuthTools(this.axiosInstance);
    this.mockTools = new MockTools(this.axiosInstance);
    this.monitorTools = new MonitorTools(this.axiosInstance);
    this.additionalFeatureTools = new AdditionalFeatureTools(this.axiosInstance);
    this.sdkTools = new SdkTools(this.axiosInstance);

    // Initialize tool definitions
    this.toolDefinitions = [
      ...this.workspaceTools.getToolDefinitions(),
      ...this.environmentTools.getToolDefinitions(),
      ...this.collectionTools.getToolDefinitions(),
      ...this.userTools.getToolDefinitions(),
      ...this.apiTools.getToolDefinitions(),
      ...this.authTools.getToolDefinitions(),
      ...this.mockTools.getToolDefinitions(),
      ...this.monitorTools.getToolDefinitions(),
      ...this.additionalFeatureTools.getToolDefinitions(),
      ...this.sdkTools.getToolDefinitions(),
    ];

    // Initialize tool handlers map
    const toolMapping = {
      ...this.workspaceTools.getToolMappings(),
      ...this.environmentTools.getToolMappings(),
      ...this.collectionTools.getToolMappings(),
      ...this.userTools.getToolMappings(),
      ...this.apiTools.getToolMappings(),
      ...this.authTools.getToolMappings(),
      ...this.mockTools.getToolMappings(),
      ...this.monitorTools.getToolMappings(),
      ...this.additionalFeatureTools.getToolMappings(),
      ...this.sdkTools.getToolMappings(),
    };
    this.toolHandlers = new Map(Object.entries(toolMapping));

    // Initialize request handlers
    new McpResourceHandler(this.server);
    new ResourceTemplateHandler(this.server);
    new PromptHandler(this.server);
    new ToolRequestHandler(this.server, this.toolDefinitions, this.toolHandlers);

    // Setup error handling
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    // Handle MCP server errors
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
      // Log additional error details if available
      if (error instanceof McpError) {
        console.error(`Error Code: ${error.code}`);
        if (error.data) {
          console.error('Additional Data:', error.data);
        }
      }
    };

    // Handle process signals
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      console.error('[Uncaught Exception]', error);
      this.shutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('[Unhandled Rejection]', reason);
      this.shutdown('unhandledRejection');
    });
  }

  private async shutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) return;

    this.isShuttingDown = true;
    console.error(`\n[${signal}] Shutting down gracefully...`);

    try {
      // Close MCP server connection
      await this.server.close();

      // Cancel any pending axios requests
      if (this.axiosInstance) {
        // @ts-ignore - Cancel token source exists on axios instance
        this.axiosInstance.CancelToken.source().cancel('Server shutting down');
      }

      console.error('Cleanup completed successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  }

  async run(): Promise<void> {
    try {
      const transport = new StdioServerTransport();

      // Add transport error handling
      transport.onerror = (error) => {
        console.error('[Transport Error]', error);
        if (!this.isShuttingDown) {
          this.shutdown('transport_error');
        }
      };

      await this.server.connect(transport);
      console.error(`${CONFIG.SERVER_NAME} v${CONFIG.VERSION} running on stdio`);
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}
