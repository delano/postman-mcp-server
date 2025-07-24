import { ToolDefinition } from '../../../types/index.js';

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'list_collections',
    description: 'List all collections in a workspace. Supports filtering and pagination.',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Workspace ID',
        },
        name: {
          type: 'string',
          description: 'Filter results by collections that match the given name',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
        },
        offset: {
          type: 'number',
          description: 'Number of results to skip',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_collection',
    description: 'Get details of a specific collection',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        access_key: {
          type: 'string',
          description: "Collection's read-only access key. Using this query parameter does not require an API key.",
        },
        model: {
          type: 'string',
          enum: ['minimal'],
          description: 'Return minimal collection data (only root-level request and folder IDs)',
        },
      },
      required: ['collection_id'],
    },
  },
  {
    name: 'create_collection',
    description: 'Create a new collection in a workspace. Supports Postman Collection v2.1.0 format.',
    inputSchema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'string',
          description: 'Workspace ID. Creates in "My Workspace" if not specified.',
        },
        collection: {
          type: 'object',
          description: 'Collection details in Postman Collection Format v2.1',
          required: ['info'],
          properties: {
            info: {
              type: 'object',
              required: ['name', 'schema'],
              properties: {
                name: { type: 'string' },
                schema: { type: 'string' }
              }
            }
          }
        }
      },
      required: ['collection'],
    },
  },
  {
    name: 'update_collection',
    description: 'Update an existing collection. Full collection replacement with maximum size of 20 MB.',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        collection: {
          type: 'object',
          description: 'Collection details in Postman Collection Format v2.1',
          required: ['info', 'item'],
          properties: {
            info: {
              type: 'object',
              required: ['name', 'schema'],
              properties: {
                name: { type: 'string' },
                schema: { type: 'string' }
              }
            },
            item: { 
              type: 'array',
              items: {}
            }
          }
        }
      },
      required: ['collection_id', 'collection'],
    },
  },
  {
    name: 'patch_collection',
    description: 'Partially update a collection. Only updates provided fields.',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        collection: {
          type: 'object',
          description: 'Collection fields to update',
          properties: {
            info: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' }
              }
            }
          }
        }
      },
      required: ['collection_id', 'collection'],
    },
  },
  {
    name: 'delete_collection',
    description: 'Delete a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
      },
      required: ['collection_id'],
    },
  },
  {
    name: 'create_collection_folder',
    description: 'Create a new folder in a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        folder: {
          type: 'object',
          description: 'Folder details',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' }
          }
        }
      },
      required: ['collection_id', 'folder'],
    },
  },
  {
    name: 'get_collection_folder',
    description: 'Get details of a specific folder in a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        folder_id: {
          type: 'string',
          description: 'Folder ID',
        },
        ids: {
          type: 'boolean',
          description: 'Return only properties that contain ID values',
        },
        uid: {
          type: 'boolean',
          description: 'Return all IDs in UID format',
        },
        populate: {
          type: 'boolean',
          description: 'Return all folder contents',
        },
      },
      required: ['collection_id', 'folder_id'],
    },
  },
  {
    name: 'update_collection_folder',
    description: 'Update a folder in a collection. Acts like PATCH, only updates provided values.',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        folder_id: {
          type: 'string',
          description: 'Folder ID',
        },
        folder: {
          type: 'object',
          description: 'Folder details to update',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' }
          }
        }
      },
      required: ['collection_id', 'folder_id', 'folder'],
    },
  },
  {
    name: 'delete_collection_folder',
    description: 'Delete a folder from a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        folder_id: {
          type: 'string',
          description: 'Folder ID',
        },
      },
      required: ['collection_id', 'folder_id'],
    },
  },
  {
    name: 'create_collection_request',
    description: 'Create a new request in a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        folder_id: {
          type: 'string',
          description: 'Optional folder ID to create request in',
        },
        request: {
          type: 'object',
          description: 'Request details',
          properties: {
            name: { type: 'string' },
            method: { type: 'string' },
            url: { type: 'string' }
          }
        }
      },
      required: ['collection_id', 'request'],
    },
  },
  {
    name: 'get_collection_request',
    description: 'Get details of a specific request in a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        request_id: {
          type: 'string',
          description: 'Request ID',
        },
        ids: {
          type: 'boolean',
          description: 'Return only properties that contain ID values',
        },
        uid: {
          type: 'boolean',
          description: 'Return all IDs in UID format',
        },
        populate: {
          type: 'boolean',
          description: 'Return all request contents',
        },
      },
      required: ['collection_id', 'request_id'],
    },
  },
  {
    name: 'update_collection_request',
    description: 'Update a request in a collection. Cannot change request folder.',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        request_id: {
          type: 'string',
          description: 'Request ID',
        },
        request: {
          type: 'object',
          description: 'Request details to update',
          properties: {
            name: { type: 'string' },
            method: { type: 'string' },
            url: { type: 'string' }
          }
        }
      },
      required: ['collection_id', 'request_id', 'request'],
    },
  },
  {
    name: 'delete_collection_request',
    description: 'Delete a request from a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        request_id: {
          type: 'string',
          description: 'Request ID',
        },
      },
      required: ['collection_id', 'request_id'],
    },
  },
  {
    name: 'create_collection_response',
    description: 'Create a new response in a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        request_id: {
          type: 'string',
          description: 'Parent request ID',
        },
        response: {
          type: 'object',
          description: 'Response details',
          properties: {
            name: { type: 'string' },
            code: { type: 'number' },
            status: { type: 'string' }
          }
        }
      },
      required: ['collection_id', 'request_id', 'response'],
    },
  },
  {
    name: 'get_collection_response',
    description: 'Get details of a specific response in a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        response_id: {
          type: 'string',
          description: 'Response ID',
        },
        ids: {
          type: 'boolean',
          description: 'Return only properties that contain ID values',
        },
        uid: {
          type: 'boolean',
          description: 'Return all IDs in UID format',
        },
        populate: {
          type: 'boolean',
          description: 'Return all response contents',
        },
      },
      required: ['collection_id', 'response_id'],
    },
  },
  {
    name: 'update_collection_response',
    description: 'Update a response in a collection. Acts like PATCH, only updates provided values.',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        response_id: {
          type: 'string',
          description: 'Response ID',
        },
        response: {
          type: 'object',
          description: 'Response details to update',
          properties: {
            name: { type: 'string' },
            code: { type: 'number' },
            status: { type: 'string' }
          }
        }
      },
      required: ['collection_id', 'response_id', 'response'],
    },
  },
  {
    name: 'delete_collection_response',
    description: 'Delete a response from a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        response_id: {
          type: 'string',
          description: 'Response ID',
        },
      },
      required: ['collection_id', 'response_id'],
    },
  },
  {
    name: 'fork_collection',
    description: 'Fork a collection to a workspace',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID to fork',
        },
        workspace: {
          type: 'string',
          description: 'Destination workspace ID',
        },
        label: {
          type: 'string',
          description: 'Label for the forked collection',
        },
      },
      required: ['collection_id', 'workspace', 'label'],
    },
  },
  {
    name: 'get_collection_forks',
    description: 'Get a list of collection forks',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        },
        cursor: {
          type: 'string',
          description: 'Pagination cursor',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
        },
        direction: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort direction',
        },
        sort: {
          type: 'string',
          enum: ['createdAt'],
          description: 'Sort field',
        }
      },
      required: ['collection_id'],
    },
  },
  {
    name: 'merge_collection_fork',
    description: 'Merge a forked collection back into its parent',
    inputSchema: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          description: 'Source collection ID',
        },
        destination: {
          type: 'string',
          description: 'Destination collection ID',
        },
        strategy: {
          type: 'string',
          enum: ['default', 'updateSourceWithDestination', 'deleteSource'],
          description: 'Merge strategy',
        }
      },
      required: ['source', 'destination', 'strategy'],
    },
  },
  {
    name: 'pull_collection_changes',
    description: 'Pull changes from parent collection into forked collection',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'string',
          description: 'Collection ID',
        }
      },
      required: ['collection_id'],
    },
  },
  {
    name: 'transfer_collection_items',
    description: 'Transfer items between collections',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['folder', 'request', 'response'],
          description: 'Type of items to transfer',
        },
        ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'IDs of items to transfer',
        },
        target: {
          type: 'object',
          properties: {
            model: { type: 'string' },
            id: { type: 'string' }
          },
          description: 'Target collection/folder information',
        },
        location: {
          type: 'object',
          properties: {
            position: { type: 'string' },
            model: { type: 'string' },
            id: { type: 'string' }
          },
          description: 'Location details for placement',
        },
        mode: {
          type: 'string',
          enum: ['copy', 'move'],
          description: 'Transfer mode',
        }
      },
      required: ['type', 'ids', 'target', 'mode'],
    },
  },
];
