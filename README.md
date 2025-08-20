# Postman MCP Server
[![smithery badge](https://smithery.ai/badge/postman-api-server)](https://smithery.ai/server/postman-api-server)
**Version:** v0.2.0

An MCP server that provides access to the [Postman](https://www.postman.com/) API. Functionality is based on the [official OpenAPI specification](https://www.postman.com/postman/postman-public-workspace/documentation/i2uqzpp/postman-api). For more information, see the [Postman API documentation](https://www.postman.com/postman-public-workspace/).

This project is part of the Model Context Protocol (MCP) initiative from Anthropic. For more information, visit the [MCP GitHub repository](https://github.com/modelcontextprotocol) and the announcement on the [Anthropic blog](https://www.anthropic.com/news/model-context-protocol).

**[Skip ahead to install instructions](#installation)**


![postman-mcp-server - Cover Image](https://github.com/user-attachments/assets/e19d712f-ad97-4456-a414-d69b159a9ed2)


> [!WARNING]
> This project is currently under active development. Please use with caution and expect breaking changes.

> [!NOTE]
> AI Generated Code. I used Cline v2.2.2 with Claude 3.5 Sonnet (2024-10-22). See docs/README.md for prompts and details about how this code was generated.

<a href="https://glama.ai/mcp/servers/zoig549xfd"><img width="380" height="200" src="https://glama.ai/mcp/servers/zoig549xfd/badge" alt="postman-mcp-server MCP server" /></a>

---

* [Overview](#overview)
* [Features](#features)
  * [Collections](#collections)
  * [Environments](#environments)
  * [APIs](#apis)
  * [Authentication \& Authorization](#authentication--authorization)
  * [Additional Features](#additional-features)
* [Installation](#installation)
  * [Prerequisites](#prerequisites)
  * [Steps](#steps)
* [Usage](#usage)
  * [Setting up API Keys](#setting-up-api-keys)
  * [Using Claude Desktop](#using-claude-desktop)
  * [Using Cline](#using-cline)
  * [Using Zed](#using-zed)
* [Documentation](#documentation)
  * [Project Overview](#project-overview)
* [Rationale](#rationale)
* [Development](#development)
* [Debugging](#debugging)
* [Other MCP Servers](#other-mcp-servers)
* [License](#license)

## Overview

Postman MCP Server is a TypeScript-based MCP server that integrates with the Postman API, providing comprehensive management of Postman collections, environments, and APIs.

## Features

### Collections
- **CRUD Operations**: Create, retrieve, update, and delete Postman collections.
- **Folder Management**: Organize requests into folders within collections.
- **Request Management**: Add, update, and delete requests within collections.
- **Response Management**: Manage responses associated with requests.
- **Version Control**: Fork, merge, and pull changes for collections.
- **Comments**: Add and manage comments on collections.

### Environments
- **Manage Environments**: Create and retrieve environments for different setups.
- **CRUD Operations**: Full support for creating, updating, and deleting environments.

### APIs
- **API Management**: Create, retrieve, update, and delete APIs.
- **Schema Support**: Manage API schemas with multi-file support.
- **Tagging**: Add and manage tags for APIs.
- **Comments**: Add and manage comments on APIs.

### Authentication & Authorization
- **API Key Authentication**: Secure access using API keys.
- **Role-Based Access Control**: Manage permissions at workspace and collection levels.
- **Workspace Permissions**: Define permissions specific to workspaces.

### Additional Features
- **Private API Network**: Manage elements and folders within a private API network.
- **Webhooks**: Create webhooks to trigger collections with custom payloads.
- **Enterprise Features**: Advanced role controls and SCIM support for enterprise environments.

## Installation

### Installing via Smithery

To install Postman MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/postman-api-server):

```bash
npx -y @smithery/cli install postman-api-server --client claude
```

### Prerequisites
- [Node.js](https://nodejs.org/) installed.

### Steps

1. **Clone the repository:**
    ```bash
    git clone https://github.com/delano/postman-api-server.git
    cd postman-api-server
    ```

2. **Install dependencies:**
    ```bash
    pnpm install
    ```

3. **Build the server:**
    ```bash
    pnpm run build
    ```

4. **Run in development mode with auto-rebuild:**
    ```bash
    pnpm run watch
    ```

## Usage

### Setting up API Keys

1. **Generate your API Key**
   - Visit [Postman Account Settings](https://go.postman.co/settings/me/api-keys)
   - Click "Generate API Key"
   - Save the key securely - it won't be shown again

2. **Configure the API Key**
   - Add the key to your environment as `POSTMAN_API_KEY`
   - For Claude Desktop or Cline, include it in your config file (see configuration examples below)
   - Never commit API keys to version control

3. **Verify Access**
   - The API key provides access to all Postman resources you have permissions for
   - Test access by running a simple query (e.g., list workspaces)

> [!NOTE]
> If you're using the [Postman API collection](https://www.postman.com/postman/postman-public-workspace/documentation/i2uqzpp/postman-api) directly, store your API key as a `postman-api-key` collection variable.

### Using Claude Desktop

To use with Claude Desktop, add the server config:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

> [!IMPORTANT]
> If you're updating this provider, Claude must be restarted to pick up API changes from the input schema (i.e. When the MCP server's ToolDefinition elements have changed). This is because Claude caches the tool definitions when it starts up.

<img width="480" alt="claude-desktop-settings" src="https://github.com/user-attachments/assets/7ea7cba2-e27e-413a-a50a-590054d51344" />

#### Example configuration

```json
{
  "mcpServers": {
    "postman": {
      "command": "node",
      "args": [
        "/path/to/postman-api-server/build/index.js"
      ],
      "env": {
        "POSTMAN_API_KEY": "CHANGEME"
      }
    }
  }
}
```

### Using Cline

Using the same example configuration, add the server config to your Cline MCP Servers configuration:

<img width="480" alt="cline-settings" src="https://github.com/user-attachments/assets/651ec517-9aa2-4314-84f5-bee716aa8889" />


#### Example configuration

_Same as Claude above._

### Using Zed

I'm still trying to get this to work. From the [Zed docs](https://zed.dev/docs/assistant/model-context-protocol) it looks like it needs to be an extension ([also this issue #21455](https://github.com/zed-industries/zed/discussions/21455)).

---

## Documentation

The official [Postman API documentation](https://learning.postman.com/docs/developer/postman-api/intro-api/) is available in the [Postman Public Workspace](https://www.postman.com/postman/postman-public-workspace/).

### Project Overview

#### Postman API References & Summaries

This project leverages the Claude model and Cline extension to convert the OpenAPI specification into TypeScript code, enhancing type safety and integration within the MCP server.

This GitHub project includes [API References documentation](docs/api/references/README.md) that provides detailed guidance on utilizing the Postman platform programmatically. It covers both the Collection SDK for local development and the Postman API for cloud platform integration. Key topics include authentication mechanisms, rate limits, and in-depth documentation of all API endpoints, including workspaces, collections, environments, mock servers, monitors, and more. Additionally, the guide offers prerequisites and quick-start instructions to facilitate seamless API interactions.

The `docs/api/summaries` directory contains comprehensive Markdown summaries of the Postman API. These documents outline API endpoints, request/response formats, and implementation details essential for validating and ensuring the functionality of the MCP server. Refer to the [API Summaries README](docs/api/summaries/README.md) for an overview of the documentation structure and implementation strategies.

#### Converting OpenAPI Spec to TypeScript Code with Claude



#### Building the MCP Server

Refer to the [Handlers Documentation](src/handlers/README.md) for detailed specifications on implementing MCP server handlers. This includes URI formats, prompt requirements, and resource handling patterns. This guide is crucial for developers working on integrating and enhancing the Postman API functionalities within the MCP server.


---

## Rationale

The MCP wrapper for Postman tools makes sense primarily as an AI interaction layer for complex, multi-step operations where structure and safety are paramount. However, it may be overengineered for simple operations where direct CLI or API usage would suffice. The MCP wrapper provides most value when:

1. **Complex Operations**
- Managing multiple collections
- Coordinating environments
- Generating comprehensive reports

2. **AI-Driven Automation**
- Automated testing workflows
- API documentation maintenance
- Environment management

3. **Error-Sensitive Operations**
- Critical API testing
- Production deployments
- Compliance checking

It provides less value for:

1. **Simple Operations**
- Basic collection runs
- Single API calls
- Quick environment checks
2. **Direct CLI Usage**
- Developer-driven operations
- Local testing
- Quick iterations


## Development

Install dependencies:
```bash
pnpm install
```

Build the server:
```bash
pnpm run build
```

For development with auto-rebuild:
```bash
pnpm run watch
```

## Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), available as a package script:

```bash
pnpm run inspector
```

[Docs](https://modelcontextprotocol.io/docs/tools/inspector)

The Inspector will provide a URL to access debugging tools in your browser: http://localhost:5173. You will need to add the POSTMAN_API_KEY before connecting. Navigate to "Tools" to get started.



## Running evals

The evals package loads an mcp client that then runs the index.ts file, so there is no need to rebuild between tests. You can load environment variables by prefixing the npx command. Full documentation can be found [here](https://www.mcpevals.io/docs).

```bash
OPENAI_API_KEY=your-key  npx mcp-eval src/evals/evals.ts src/tools/api/mocks/index.ts
```
## Other MCP Servers

- [Awesome MCP Servers by AppCypher](https://github.com/appcypher/awesome-mcp-servers)
- [Awesome MCP Servers by PunkPeye](https://github.com/punkpeye/awesome-mcp-servers)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
