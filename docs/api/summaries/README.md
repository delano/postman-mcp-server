# Postman API Implementation Summary

This document outlines the prompts and processes used to implement the Postman API functionality within the MCP server tools.

## Summary documents

Each of the following documents contains a summary of the Postman API functionality that is used to cross-check against the MCP server tools implementation.

1. [Workspaces](workspaces.md)
2. [Collections](collections.md)
3. [Environments](environments.md)
4. [APIs](apis.md)
5. [Mocks](mocks.md)
6. [Monitors](monitors.md)
7. [Security Features](security-features.md)
8. [Additional Features](additional-features.md)
9. [Authentication & Authorization](auth.md)
10. [Common Features](common-features.md)
11. [Notes](notes.md)

## Prompts

**OpenAPI Specification Source:** The Postman API OpenAPI 3 definition is obtained from the [Postman Public Workspace](https://www.postman.com/postman/postman-public-workspace/documentation/i2uqzpp/postman-api) (manual process).

Building out the Postman API functionality within the MCP server tools follows this general order of operations:

1. Split Postman API OpenAPI 3 definition into individual yaml files.
2. Peruse the individual yaml files to produce summary markdown documents.
3. Use the summary markdown documents to first implement the MCP server tools and later to cross-check against the implementation.
4. Using MCP documentation, ensure the MCP server tools are correctly implemented.

The OoO is not strictly linear and the processes involved are iterative. The goal is to continually add and correct details each time we review. The process is more additive and augmentative early on; later on it becomes more about cross-checking, correcting, and reducing. The goal is to keep files concise and focused.

Some version of this process can be repeated to implement changes to the Postman API spec. The same can be done for the MCP server tools implementation.


### Utilizing MCP Server Tools

#### List Workspaces

```prompt
Use Postman tools to list our workspaces.
```

```
Use postman tools to list environments in a workspace: 0ddc8458-12e6-48bf-8ff0-490ca0a8f775


```

### Improving MCP Server Tools

#### General Improvements
```prompt
@/docs/api/summaries/workspaces.md

Review the postman MCP tools workspace API access against the Postman API summary. Make corrections in our implementation.

```

#### Specific Improvements

##### Workspaces
```prompt
@/docs/api/summaries/environments.md

Review the postman MCP tools workspace API access against the Postman API summary. Make corrections in our implementation, paying particular attention to the request parameter naming and values.
```

##### Environments
```prompt
@/docs/api/summaries/wokspaces.md
@/docs/api/summaries/environments.md

Review the postman workspaces and environment docs. Understand the details and nuance around contstructuing environment identifier and using it appropriately when querying. Modify out MCP tools implementation accordingly.

@src/index.ts
@src/tools/api/workspaces.ts
@src/tools/api/environments.ts
```

```prompt
@/docs/api/summaries/environments.md
@/docs/api/references/postman-api-requestBodies.yaml

Review the postman environment md docs and yaml definitions. Understand the details and nuance of request bodies for POST/PUT requests. Modify out MCP tools implementation accordingly, including inline jsdocs.


@src/tools/api/environments.ts
@src/types.ts


We may also need to update the MCP protocol endpoints to reflect the changes. IOW, updating our code that communicates with the Postman API is one part but we also may need to update the MCP protocol code that communicates with the MCP clients.

```

```prompt
@/docs/api/summaries/collections.md
@/docs/api/references/postman-api-parameters.yaml
@/docs/api/references/postman-api-responsesonly.yaml
@/docs/api/references/postman-api-requestBodies.yaml

Review the postman collection md docs and yaml definitions. Understand the details and nuance of request bodies for POST/PUT/PATCH requests. Modify out MCP tools implementation accordingly, including inline jsdocs.


@src/tools/api/collections.ts
@src/types.ts


Refer to @/docs/dev/updating-request-bodies.md for what areas of the code need to be updated.
```

```prompt
@/docs/api/summaries/collections.md
@/docs/api/references/postman-api-parameters.yaml
@/docs/api/references/postman-api-responsesonly.yaml
@/docs/api/references/postman-api-requestBodies.yaml

Review the postman collection md docs and yaml definitions. Understand the details and nuance of requests and responses for GET/HEAD/OPTION/DELETE requests. Modify out MCP tools implementation accordingly, including inline jsdocs.


@src/tools/api/collections.ts
@src/types.ts


Refer to @/docs/dev/updating-request-bodies.md for what areas of the code need to be updated.
```
##### APIs

```prompt
@/docs/api/summaries/apis.md
@/docs/api/references/postman-api-parameters.yaml
@/docs/api/references/postman-api-requestBodies.yaml

Review the postman apis md docs and yaml definitions to implement `src/tools/api/apis.ts`. Understand the details and nuance of parameters and request bodies for POST/PUT/PATCH/GET/HEAD/OPTION/DELETE  requests. Modify out MCP tools implementation accordingly, including inline jsdocs.

@src/types/index.ts


We may also need to update the MCP protocol endpoints to reflect the changes. IOW, updating our code that communicates with the Postman API is one part but we also may need to update the MCP protocol code that communicates with the MCP clients.
```

##### MCP Protocol

```prompt

Revise the MCP protocol implementation to ensure the "List Resources", "List Prompts" endpoints are functionality fully and correctly.

@src/index.ts

```

### Improving codebase

#### Reduce duplication and emphasize concise files

More concise and focused files are easier to work with the models.

```prompt
@/src/index.ts

Review the main code entrypoint src/index.ts to devise a strategy to reduce duplication and manage complexity as functionality is added.


For example:
1)  `setupToolHandlers` currently defines the superset of all tool handlers which means it's length is unmitigated. Each tool should be responsible for defining its own handlers.

2) PostmanAPIServer should be defined in its own file and imported into the main index.ts file.

3) setupHandlers should be refactored similarly to setupToolHandlers.

4) Repetative function definitions should be refactored into at most one additional layer of abstraction.

```

```prompt
@/src/server.ts

Review the main server src/server.ts to continue reducing duplication and managing complexity as functionality is added.

`this.server.setRequestHandler(CallToolRequestSchema, async (request) => {...` can be update to implement like `ListToolsRequestSchema`.
```

#### Adding tool implementation

```prompt
@/docs/api/summaries/additional-features.md

@/docs/api/summaries/common-features.md

@/docs/api/references/postman-api-parameters.yaml

@/docs/api/references/postman-api-requestBodies.yaml

Review the postman md docs and yaml definitions to implement our MCP tool wrapper `src/tools/api/additional-features/index.ts`. Understand the details and nuance of parameters and request bodies for POST/PUT/PATCH/GET/HEAD/OPTION/DELETE  requests. Modify out MCP tools implementation accordingly, including inline jsdocs. Use `src/tools/api/environments/index.ts` as a reference for how to implement the wrapper. (When implementing ToolDefinition, the required field is required).

NOTE: this MCP server is a wrapper around existing API functionality that will be doing the actual validation so simplify the validation to just required fields. Keep the basic types and enums for type safety and documentation.

@src/types/index.ts

```

#### Reviewing tool implementations

```prompt
@/docs/api/summaries/apis.md

@/docs/api/summaries/common-features.md

@/docs/api/references/postman-api-parameters.yaml

@/docs/api/references/postman-api-requestBodies.yaml

Review the postman md docs and yaml definitions to cross check our MCP tools implementation `src/tools/api/apis/index.ts`. Understand the details and nuance of parameters and request bodies for POST/PUT/PATCH/GET/HEAD/OPTION/DELETE  requests. Modify out MCP tools implementation accordingly, including inline jsdocs. Use `src/tools/api/environments/index.ts` as a reference for how to implement the wrapper.

NOTE: this MCP server is a wrapper around existing API functionality that will be doing the actual validation so simplify the validation to just required fields. Keep the basic types and enums for type safety and documentation.

NOTE2: The best code is code that doesn't need to be written. If we analyse the imnplementation determine we do not need to write any code, that's a win. The goal is to be as minimal as possible.

@src/types/index.ts
@src/tools/api/base.ts

```

#### Reviewing MCP Server details

```prompt
@https://modelcontextprotocol.io/docs/concepts/resources

Peruse the Model Context Protocol documentation. In order to expose data to models automatically, server authors should use a model-controlled primitive such as Tools.

Review the MCP server details to ensure the "List Resources"  endpoint is functionality fully and correctly. It should return a list of all resources that are available for the user to interact with.

```


```prompt
@https://modelcontextprotocol.io/docs/concepts/prompts


Peruse the Model Context Protocol documentation. In order to expose data to models automatically, server authors should use a model-controlled primitive such as Tools.

Review the MCP server details to ensure the "List Prompts"  endpoint is functionality fully and correctly. It should return a list of all resources that are available for the user to interact with.

```

```prompt

@https://modelcontextprotocol.io/docs/concepts/tools

Peruse the Model Context Protocol documentation. In order to expose data to models automatically, server authors should use a model-controlled primitive such as Tools.

Review the MCP server details to ensure the "List Tools"  endpoint is functionality fully and correctly. It should return a list of all resources that are available for the user to interact with.

NOTE: We may need to add a new handler interface called ToolResourceHandler. The existing ToolHandler is used for the tool itself, not the resources that the tool can interact with. See @src/types/index.ts for the existing ToolHandler, ResourceHandler interfaces.

```

```prompt

@https://modelcontextprotocol.io/docs/concepts/transports

Peruse the Model Context Protocol transports documentation. Transports in the Model Context Protocol (MCP) provide the foundation for communication between clients and servers. A transport handles the underlying mechanics of how messages are sent and received.

While the TypeScript MCP SDK handles all of the server <=> client communication including implementing the transport layer, the server still needs to implement the SDK correctly.

Review @src/server.ts to ensure the MCP server is correctly implementing the TypeScript SDK following best practices and security recommendations.

```



### Improving Documentation

#### Linking to Postman API References
```prompt

Update this docs/references README.md file with a summary and links for each of:

Workspaces
Collections
Environments and variables
APIs
Mock servers
Monitors
Comments
Forks
Pull requests
User and usage data
Users and user groups
Roles
Billing

Add both the relevant `https://www.postman.com/postman/postman-public-workspace/` and  `https://learning.postman.com/docs` links to each of the above sections.
```

#### Adding Authentication Details

```prompt
@URL:https://learning.postman.com/docs/developer/postman-api/authentication/

Based on the content of the postman doc linked, add a new section with concise but complete details including relevant links (`learning.postman.com`, `go.postman.com`, `www.postman.com` pages) to this readme.md
```

#### Reviewing and Updating Documentation

```prompt
Proofread and tidy this markdown readme to a professional standard. Do not make up new content to add; and do not omit existing content, except where redundant and or unclear.
```


### Expanding Postman API Summaries

#### Working on Individual Files

##### Add Responses
```prompt
@/docs/api/references/postman-api-pathsonly.yaml

Peruse the postman OpenAPI 3 paths definition (note this is a very abrridged version of the full document, containing just the paths objects), this time to add the expected response references and associated http status (e.g. 200 '#/components/responses/getAccounts').

Continue updating the individual summary markdown document that we can use later on to cross-check against our tool implementations:
@/docs/api/summaries/collections.md

Workthrough the markdown summary document, operating one endpoint at a time, updating its documentation based on the contents of the pathsonly file. Each request endpoint in the pathsonly OpenAPI 3 definition document should have a list of `responses:`. Those are the details we want to add to the summary markdown doc.

Also continue to add missing endpoints that you come across. The goal is to be "additive" and "augmentative" so that we continually add and correct details each time we review. Do not remove details or re-summarize existing content.

When completed this file, request the next summary document to continue with. Keep doing this until I say stop or you get bored.
```

##### Add Parameters
```prompt
@/docs/api/references/postman-api-pathsonly.yaml

Peruse the postman OpenAPI 3 paths definition (note this is a very abrridged version of the full document, containing just the paths objects), this time to add the expected parameters references and associated http status (e.g. '#/components/parameters/workspaceQuery').

Continue updating the individual summary markdown document that we can use later on to cross-check against our tool implementations:
@/docs/api/summaries/environments.md
@/docs/api/summaries/workspaces.md
@/docs/api/summaries/collections.md
@/docs/api/summaries/apis.md
@/docs/api/summaries/mocks.md
@/docs/api/summaries/monitors.md
@/docs/api/summaries/security-features.md
@/docs/api/summaries/additional-features.md
@/docs/api/summaries/auth.md
@/docs/api/summaries/common-features.md
@/docs/api/summaries/notes.md

Workthrough the markdown summary document, operating one endpoint at a time, updating its documentation based on the contents of the definition file. Each request endpoint in the pathsonly OpenAPI 3 definition document should have a list of `parameters:`. Those are the details we want to add to the summary markdown doc.

Also continue to add missing endpoints that you come across. The goal is to be "additive" and "augmentative" so that we continually add and correct details each time we review. Do not remove details or re-summarize existing content.

When completed this file, request the next summary document to continue with. Keep doing this until I say stop or you get bored.
```

##### Add Parameter Details
```prompt
@/docs/api/references/postman-api-parameters.yaml

Peruse the postman OpenAPI 3 definition (note this is a very abrridged version of the full document, containing just the parameters objects), this time to add parameter details by matching the parameter name (e.g. The workspaceQuery in '#/components/parameters/workspaceQuery').

Continue updating the individual summary markdown document that we can use later on to cross-check against our tool implementations:
@/docs/api/summaries/environments.md
@/docs/api/summaries/workspaces.md
@/docs/api/summaries/collections.md
@/docs/api/summaries/apis.md
@/docs/api/summaries/mocks.md
@/docs/api/summaries/monitors.md
@/docs/api/summaries/security-features.md
@/docs/api/summaries/additional-features.md
@/docs/api/summaries/auth.md
@/docs/api/summaries/common-features.md
@/docs/api/summaries/notes.md

Workthrough the markdown summary document, operating one endpoint at a time, updating its documentation based on the contents of the definition file.

NOTE: The goal is to be "additive" and "augmentative" so that we continually add and correct details each time we review. Do not remove details or re-summarize existing content.

When completed this file, request the next summary document to continue with. Keep doing this until I say stop or you get bored.
```

##### Add Request Bodies (Paths Only)
```prompt
@/docs/api/references/postman-api-pathsonly.yaml

Peruse the postman OpenAPI 3 definition (note this is a very abrridged version of the full document, containing just the paths objects), this time to augment the POST/PUT requests with body content add parameter details by matching the parameter name (e.g. The updateEnvironment in '#/components/requestBodies/updateEnvironment').

Continue updating the individual summary markdown document that we can use later on to cross-check against our tool implementations:
@/docs/api/summaries/environments.md
@/docs/api/summaries/workspaces.md
@/docs/api/summaries/collections.md
@/docs/api/summaries/apis.md
@/docs/api/summaries/mocks.md
@/docs/api/summaries/monitors.md
@/docs/api/summaries/security-features.md
@/docs/api/summaries/additional-features.md
@/docs/api/summaries/auth.md
@/docs/api/summaries/common-features.md
@/docs/api/summaries/notes.md

Workthrough the markdown summary document, operating one endpoint at a time, updating its documentation based on the contents of the definition file. Each POST/PUT/etc request endpoint in the pathsonly OpenAPI 3 definition document should have at least one `requestBody:`. Those are the details we want to add to the summary markdown doc.

Also continue to add missing endpoints that you come across. The goal is to be "additive" and "augmentative" so that we continually add and correct details each time we review. Do not remove details or re-summarize existing content.

When completed this file, request the next summary document to continue with. Keep doing this until I say stop or you get bored.
```

##### Review for missing endpoints

```prompt
@/docs/api/references/postman-api-pathsonly.yaml

Peruse the postman OpenAPI 3 paths definition (note this is a very abrridged version of the full document, containing just the paths objects). Compare to @/docs/api/summaries/ .md files for missing endpoints. Add missing endpoints to the summary markdown files.
```

##### Add Request Bodies
```prompt
@/docs/api/references/postman-api-requestbodies.yaml

Review the abridged Postman OpenAPI 3 definition (containing only the requestBody objects) to augment POST/PUT requests with body content by matching request body names (e.g., `updateEnvironment` in '#/components/requestBodies/updateEnvironment').

Update the corresponding summary markdown documents:
- @/docs/api/summaries/environments.md
- @/docs/api/summaries/workspaces.md
- @/docs/api/summaries/collections.md
- @/docs/api/summaries/apis.md
- @/docs/api/summaries/mocks.md
- @/docs/api/summaries/monitors.md
- @/docs/api/summaries/security-features.md
- @/docs/api/summaries/additional-features.md
- @/docs/api/summaries/auth.md
- @/docs/api/summaries/common-features.md
- @/docs/api/summaries/notes.md

For each POST/PUT request endpoint, add `requestBody:` details to the summary markdown based on the definition file.

Continue adding missing endpoints to ensure comprehensive documentation. Maintain an additive and augmentative approach without removing existing content.

Upon completion, request the next summary document to continue. Repeat until instructed to stop.
```

### Splitting a Single Summary File into Multiple Files
```prompt
@docs/postman-api-summary.md

Let's split the single summary doc into multiple docs to help keep the size manageable. Create a new directory under docs/ and split the content at the `##` header level (e.g. "## Workspaces" is one document)
```

### Creating a Summary Document
```prompt
@/docs/api/references/postman-api-index.yaml

Review the postman environment, collection API from the OpenAPI 3 definition. Make a summary document that we can use to cross-check against our tool implementations (This implementation covers the basic Postman API functionality in MCP)
```
