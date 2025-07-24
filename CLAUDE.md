# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server that provides access to the Postman API. The server acts as a bridge between Claude and Postman's cloud platform, enabling AI-driven interaction with collections, environments, workspaces, APIs, and other Postman resources.

**Key Technologies:**
- TypeScript with Node.js (ES2022 modules)
- MCP SDK (@modelcontextprotocol/sdk)
- Axios for HTTP requests
- Zod for validation

## Development Commands

```bash
# Install dependencies
pnpm install

# Build the project (TypeScript compilation + executable permissions)
pnpm run build

# Development mode with auto-rebuild
pnpm run watch

# Debug with MCP Inspector
pnpm run inspector
```

## Important Reference Documentation

The `docs/` directory contains critical reference materials used as resources for understanding and working on the Postman API server tools:

- **`docs/api/references/`** - OpenAPI specification files derived from Postman API, organized by major sections and named for AI tool compatibility
- **`docs/api/summaries/`** - Comprehensive Markdown summaries of Postman API endpoints, request/response formats, and implementation details essential for MCP server validation
- **`docs/api/summaries/README.md`** - **PARTICULARLY IMPORTANT** - Documents the interactive development process and workflow for implementing Postman API functionality, including specific prompts and iterative development patterns
- **`docs/dev/postman-cli-design-doc.md`** - Design document for potential Postman CLI integration
- **`src/handlers/README.md`** - Detailed specifications for MCP server handler implementation patterns

### Development Workflow Process

The docs serve as resources for an iterative development process:

1. **Obtain OpenAPI spec** from [Postman Public Workspace](https://www.postman.com/postman/postman-public-workspace/documentation/i2uqzpp/postman-api) (manual process)
2. Split Postman API OpenAPI 3 definition into individual YAML files
3. Create summary markdown documents from YAML files
4. Implement MCP server tools using summaries
5. Cross-check implementations against summaries
6. Ensure MCP protocol compliance

The process is additive and augmentative early on, becoming more focused on cross-checking, correcting, and reducing complexity over time.

These docs should be consulted when:
- Understanding API endpoint behavior and parameters
- Implementing new tools or extending existing ones
- Validating MCP server functionality against Postman API specification
- Working with the handler architecture patterns
- Following the established development workflow

## Architecture


### Core Structure

- **`src/server.ts`** - Main PostmanAPIServer class that orchestrates all components
- **`src/index.ts`** - Entry point that creates and runs the server
- **`src/handlers/`** - MCP protocol handlers (tools, resources, prompts)
- **`src/tools/api/`** - Postman API tool implementations organized by domain
- **`src/types/`** - TypeScript type definitions

### Tool Architecture

Tools are organized by Postman API domains:
- **Workspaces** - Workspace management
- **Collections** - Collection CRUD, folders, requests, responses, version control
- **Environments** - Environment variables and configurations
- **APIs** - API definitions, schemas, versions, comments
- **Auth** - Authentication and authorization management
- **Mocks** - Mock server creation and management
- **Monitors** - Collection monitoring and webhooks
- **Users** - User and team management
- **Additional Features** - Private API Network, billing, roles

### Base Tool Pattern

All tools inherit from `BasePostmanTool` (src/tools/api/base.ts) which provides:
- HTTP client with automatic error mapping to MCP error codes
- Common authentication handling via `X-Api-Key` header
- Standard tool registration and mapping methods

### Handler Pattern

The server uses specialized handlers for different MCP protocol aspects:
- **ToolHandler** - Executes tool calls by delegating to appropriate tool classes
- **ResourceHandler** - Handles direct resource URIs (e.g., `postman://workspaces`)
- **ResourceTemplateHandler** - Handles parameterized URIs (e.g., `postman://workspaces/{id}/collections`)
- **PromptHandler** - Provides AI-friendly prompts for common operations

## Configuration

The server requires a `POSTMAN_API_KEY` environment variable. API keys are generated in [Postman Account Settings](https://go.postman.co/settings/me/api-keys).

Rate limits: 300 requests per minute per user.

## URI Formats

### Direct Resources
```
postman://workspaces          # List all workspaces
postman://collections         # List all collections
postman://environments        # List all environments
```

### Templated Resources
```
postman://workspaces/{id}/collections     # Collections in a workspace
postman://apis/{id}/versions              # Versions of an API
postman://collections/{id}/requests       # Requests in a collection
```

## Error Handling

HTTP status codes are mapped to MCP error codes:
- 400/422 → InvalidRequest (validation errors)
- 401 → InvalidRequest (authentication)
- 403 → InvalidRequest (authorization)
- 404 → InvalidRequest (not found)
- 429 → InvalidRequest (rate limit)
- 5xx → InternalError


## Development Notes

- All modules use ES2022 with Node16 module resolution
- Strict TypeScript configuration enforced
- Error handling follows MCP error code conventions
- Tool definitions use snake_case naming
- The build process sets executable permissions on the output
