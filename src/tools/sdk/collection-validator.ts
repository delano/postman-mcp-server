import pkg from 'postman-collection';
import type * as PostmanCollection from 'postman-collection';
const { Collection, Item } = pkg;
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

interface ValidationResult {
  isValid: boolean;
  details: {
    errors: string[];
    warnings: string[];
    suggestions: string[];
  };
}

/**
 * Validates a Postman Collection JSON and provides detailed feedback
 * This leverages the SDK's built-in schema validation and collection manipulation
 * capabilities to provide richer validation than simple JSON Schema checks
 */
export async function validateCollection(collectionJson: Record<string, unknown>): Promise<ValidationResult> {
  try {
    // Attempt to create Collection instance which runs schema validation
    const collection = new Collection(collectionJson);

    const details: ValidationResult['details'] = {
      errors: [],
      warnings: [],
      suggestions: []
    };

    // Validate collection has required fields
    if (!collection.name) {
      details.errors.push('Collection must have a name');
    }

    // Check for common issues
    if (!collection.describe) {
      details.warnings.push('Collection lacks description which helps other users understand its purpose');
    }

    // Validate all requests
    collection.forEachItem((item: PostmanCollection.Item) => {
      if (!item.request) {
        details.errors.push(`Item "${item.name}" is missing request definition`);
        return;
      }

      // Check request URL
      const request = item.request;
      if (!request.url) {
        details.errors.push(`Request "${item.name}" is missing URL`);
      }

      // Validate request method
      if (!request.method) {
        details.errors.push(`Request "${item.name}" is missing HTTP method`);
      }

      // Check for best practices
      if (!item.name) {
        details.warnings.push('Request is missing name which makes it harder to identify');
      }
      if (!item.describe) {
        details.suggestions.push(`Consider adding description to request "${item.name}"`);
      }
    });

    return {
      isValid: details.errors.length === 0,
      details
    };

  } catch (error) {
    if (error instanceof Error) {
      throw new McpError(ErrorCode.InvalidRequest, error.message);
    }
    throw error;
  }
}
