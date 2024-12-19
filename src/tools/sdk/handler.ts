import { AxiosInstance } from 'axios';
import { ToolHandler, ToolDefinition, ToolCallResponse, ToolResource } from '../../types/tool.js';
import { validateCollection } from './collection-validator.js';

export class SdkTools implements ToolHandler {
  constructor(private readonly axios: AxiosInstance) {}

  private readonly tools: ToolDefinition[] = [
    {
      name: 'validate_collection',
      description: 'Validates a Postman Collection using the official SDK, providing detailed feedback beyond basic schema validation',
      inputSchema: {
        type: 'object',
        properties: {
          collection: {
            type: 'object',
            description: 'The collection JSON to validate'
          }
        },
        required: ['collection']
      }
    }
  ];

  getToolDefinitions(): ToolDefinition[] {
    return this.tools;
  }

  getToolMappings(): Record<string, ToolHandler> {
    return {
      validate_collection: this
    };
  }

  async handleToolCall(name: string, args: Record<string, unknown>): Promise<ToolCallResponse> {
    switch (name) {
      case 'validate_collection':
        const result = await validateCollection(args.collection as Record<string, unknown>);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }]
        };
      default:
        return {
          content: [{
            type: 'text',
            text: `Unknown tool: ${name}`
          }],
          isError: true
        };
    }
  }

  // Resource handling methods - not used for this simple integration
  async listToolResources(): Promise<ToolResource[]> {
    return [];
  }

  async getToolResourceDetails(): Promise<ToolResource> {
    throw new Error('Resource operations not supported');
  }

  async canHandleResource(): Promise<boolean> {
    return false;
  }
}
