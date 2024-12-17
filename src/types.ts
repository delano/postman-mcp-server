import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
}

export interface WorkspaceArg {
  workspace: string;
}

export interface EnvironmentIdArg {
  environmentId: string;
}

export interface CollectionIdArg {
  collection_id: string;
}

export interface EnvironmentValue {
  key: string;
  value: string;
  type?: 'default' | 'secret';
  enabled?: boolean;
}

export interface CreateEnvironmentArgs {
  environment: {
    name: string;
    values: EnvironmentValue[];
  };
  workspace?: string;
}

export interface UpdateEnvironmentArgs {
  environmentId: string;
  environment: {
    name?: string;
    values?: EnvironmentValue[];
  };
}

export interface ForkEnvironmentArgs {
  environmentId: string;
  label: string;
  workspace: string;
}

export interface GetEnvironmentForksArgs {
  environmentId: string;
  cursor?: string;
  direction?: 'asc' | 'desc';
  limit?: number;
  sort?: 'createdAt';
}

export interface MergeEnvironmentForkArgs {
  environmentId: string;
  source: string;
  destination: string;
  strategy?: {
    deleteSource?: boolean;
  };
}

export interface PullEnvironmentArgs {
  environmentId: string;
  source: string;
  destination: string;
}

export interface CreateCollectionArgs extends WorkspaceArg {
  name: string;
  description?: string;
  schema: object;
}

export interface UpdateCollectionArgs extends CollectionIdArg {
  name: string;
  description?: string;
  schema: object;
}

export interface ForkCollectionArgs extends CollectionIdArg, WorkspaceArg {
  label: string;
}

export interface ToolHandler {
  axiosInstance: AxiosInstance;
  getToolDefinitions(): ToolDefinition[];
}

// Type guards
export function isWorkspaceArg(obj: unknown): obj is WorkspaceArg {
  return typeof obj === 'object' && obj !== null && typeof (obj as WorkspaceArg).workspace === 'string';
}

export function isEnvironmentIdArg(obj: unknown): obj is EnvironmentIdArg {
  return typeof obj === 'object' && obj !== null && typeof (obj as EnvironmentIdArg).environmentId === 'string';
}

export function isCollectionIdArg(obj: unknown): obj is CollectionIdArg {
  return typeof obj === 'object' && obj !== null && typeof (obj as CollectionIdArg).collection_id === 'string';
}

export function isEnvironmentValue(obj: unknown): obj is EnvironmentValue {
  if (typeof obj !== 'object' || obj === null) return false;
  const value = obj as EnvironmentValue;
  return (
    typeof value.key === 'string' &&
    typeof value.value === 'string' &&
    (value.type === undefined || value.type === 'default' || value.type === 'secret') &&
    (value.enabled === undefined || typeof value.enabled === 'boolean')
  );
}

export function constructEnvironmentUid(owner: string, id: string): string {
  return `${owner}-${id}`;
}

export function isValidUid(id: string): boolean {
  // Format: ownerId-environmentId, e.g., "31912785-b8cdb26a-0c58-4f35-9775-4945c39d7ee2"
  const parts = id.split('-');
  if (parts.length < 2) return false;

  const ownerId = parts[0];
  const environmentId = parts.slice(1).join('-');

  // Owner ID should be numeric
  if (!/^\d+$/.test(ownerId)) return false;

  // Environment ID should be a UUID
  return /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/.test(environmentId);
}

export function isCreateEnvironmentArgs(obj: unknown): obj is CreateEnvironmentArgs {
  if (typeof obj !== 'object' || obj === null) return false;
  const args = obj as CreateEnvironmentArgs;
  return (
    typeof args.environment === 'object' &&
    args.environment !== null &&
    typeof args.environment.name === 'string' &&
    Array.isArray(args.environment.values) &&
    args.environment.values.every(isEnvironmentValue) &&
    (args.workspace === undefined || typeof args.workspace === 'string')
  );
}

export function isUpdateEnvironmentArgs(obj: unknown): obj is UpdateEnvironmentArgs {
  if (typeof obj !== 'object' || obj === null) return false;
  const args = obj as UpdateEnvironmentArgs;
  return (
    typeof args.environmentId === 'string' &&
    isValidUid(args.environmentId) &&
    typeof args.environment === 'object' &&
    args.environment !== null &&
    (args.environment.name === undefined || typeof args.environment.name === 'string') &&
    (args.environment.values === undefined || (Array.isArray(args.environment.values) && args.environment.values.every(isEnvironmentValue)))
  );
}

export function isForkEnvironmentArgs(obj: unknown): obj is ForkEnvironmentArgs {
  if (typeof obj !== 'object' || obj === null) return false;
  const args = obj as ForkEnvironmentArgs;
  return (
    typeof args.environmentId === 'string' &&
    typeof args.label === 'string' &&
    typeof args.workspace === 'string' &&
    isValidUid(args.environmentId)
  );
}

export function isGetEnvironmentForksArgs(obj: unknown): obj is GetEnvironmentForksArgs {
  if (typeof obj !== 'object' || obj === null) return false;
  const args = obj as GetEnvironmentForksArgs;
  return (
    typeof args.environmentId === 'string' &&
    isValidUid(args.environmentId) &&
    (args.cursor === undefined || typeof args.cursor === 'string') &&
    (args.direction === undefined || args.direction === 'asc' || args.direction === 'desc') &&
    (args.limit === undefined || typeof args.limit === 'number') &&
    (args.sort === undefined || args.sort === 'createdAt')
  );
}

export function isMergeEnvironmentForkArgs(obj: unknown): obj is MergeEnvironmentForkArgs {
  if (typeof obj !== 'object' || obj === null) return false;
  const args = obj as MergeEnvironmentForkArgs;
  return (
    typeof args.environmentId === 'string' &&
    typeof args.source === 'string' &&
    typeof args.destination === 'string' &&
    isValidUid(args.environmentId) &&
    isValidUid(args.source) &&
    isValidUid(args.destination) &&
    (args.strategy === undefined || (
      typeof args.strategy === 'object' &&
      args.strategy !== null &&
      (args.strategy.deleteSource === undefined || typeof args.strategy.deleteSource === 'boolean')
    ))
  );
}

export function isPullEnvironmentArgs(obj: unknown): obj is PullEnvironmentArgs {
  if (typeof obj !== 'object' || obj === null) return false;
  const args = obj as PullEnvironmentArgs;
  return (
    typeof args.environmentId === 'string' &&
    typeof args.source === 'string' &&
    typeof args.destination === 'string' &&
    isValidUid(args.environmentId) &&
    isValidUid(args.source) &&
    isValidUid(args.destination)
  );
}

export function isCreateCollectionArgs(obj: unknown): obj is CreateCollectionArgs {
  if (!isWorkspaceArg(obj)) return false;
  const args = obj as CreateCollectionArgs;
  return (
    typeof args.name === 'string' &&
    (args.description === undefined || typeof args.description === 'string') &&
    typeof args.schema === 'object' && args.schema !== null
  );
}

export function isUpdateCollectionArgs(obj: unknown): obj is UpdateCollectionArgs {
  if (!isCollectionIdArg(obj)) return false;
  const args = obj as UpdateCollectionArgs;
  return (
    typeof args.name === 'string' &&
    (args.description === undefined || typeof args.description === 'string') &&
    typeof args.schema === 'object' && args.schema !== null
  );
}

export function isForkCollectionArgs(obj: unknown): obj is ForkCollectionArgs {
  return (
    isCollectionIdArg(obj) &&
    isWorkspaceArg(obj) &&
    typeof (obj as ForkCollectionArgs).label === 'string'
  );
}

// Validation helper
export function validateArgs<T>(
  obj: unknown,
  validator: (obj: unknown) => obj is T,
  errorMessage: string
): T {
  if (!validator(obj)) {
    throw new McpError(ErrorCode.InvalidParams, errorMessage);
  }
  return obj;
}
