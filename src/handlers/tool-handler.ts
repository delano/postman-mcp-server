import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ToolDefinition,
  ToolHandler as IToolHandler,
  ToolResource
} from '../types/index.js';
import axios from 'axios';

// Schema for listing tool resources
const ListToolResourcesRequestSchema = z.object({
  method: z.literal('tools/resources/list')
});

// Detect if we're running in Bun
const isBunRuntime = typeof (globalThis as any).Bun !== 'undefined';

/**
 * Handles tool-related requests and connects them to tool implementations
 */
export class ToolHandler {
  constructor(
    private server: Server,
    private toolDefinitions: ToolDefinition[],
    private toolHandlers: Map<string, IToolHandler>
  ) {
    this.setupHandlers();
  }

  private setupHandlers() {
    this.setupListTools();
    this.setupCallTool();
    // Only setup tool resources handler if not running in Bun (due to type compatibility issues)
    if (!isBunRuntime) {
      this.setupListToolResources();
    }
  }

  private setupListTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.toolDefinitions,
    }));
  }

  private setupListToolResources() {
    this.server.setRequestHandler(ListToolResourcesRequestSchema as any, async () => {
      try {
        const allResources: ToolResource[] = [];

        // Gather resources from all tool handlers
        for (const [toolName, handler] of this.toolHandlers.entries()) {
          if ('listToolResources' in handler) {
            const resources = await handler.listToolResources();
            allResources.push(...resources);
          }
        }

        return {
          resources: allResources
        };
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          error instanceof Error ? error.message : 'Failed to list tool resources'
        );
      }
    });
  }

  private async validateToolResource(toolName: string, resourceUri: string): Promise<boolean> {
    const handler = this.toolHandlers.get(toolName);
    if (!handler || !('canHandleResource' in handler)) {
      return false;
    }
    return handler.canHandleResource(resourceUri);
  }

  private setupCallTool() {
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args = {} } = request.params;

        // Find the tool definition
        const toolDef = this.toolDefinitions.find(t => t.name === name);
        if (!toolDef) {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
        }

        // Get the appropriate handler
        const handler = this.toolHandlers.get(name);
        if (!handler) {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `No handler found for tool: ${name}`
          );
        }

        // If the tool is operating on a resource, validate access
        if ('resourceUri' in args && typeof args.resourceUri === 'string') {
          const canHandle = await this.validateToolResource(name, args.resourceUri);
          if (!canHandle) {
            throw new McpError(
              ErrorCode.InvalidRequest,
              `Tool ${name} cannot operate on resource: ${args.resourceUri}`
            );
          }
        }

        // Execute the tool call
        const response = await handler.handleToolCall(name, args);

        // Transform the response to match the SDK's expected format
        return {
          _meta: {},
          tools: [toolDef],
          content: response.content,
          isError: response.isError,
        };
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        if (axios.isAxiosError(error)) {
          return {
            _meta: {},
            tools: [],
            content: [
              {
                type: 'text',
                text: `Postman API error: ${error.response?.data?.error?.message || error.message}`,
              },
            ],
            isError: true,
          };
        }
        throw new McpError(
          ErrorCode.InternalError,
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
      }
    });
  }
}
