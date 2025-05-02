//evals.ts

import { EvalConfig } from 'mcp-evals';
import { openai } from "@ai-sdk/openai";
import { grade, EvalFunction } from "mcp-evals";

const listMocksEval: EvalFunction = {
    name: 'listMocks Tool Evaluation',
    description: 'Evaluates the listing of mock servers',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please list all mock servers for team ID 123 in the dev workspace.");
        return JSON.parse(result);
    }
};

const createMockEval: EvalFunction = {
    name: "CreateMock Tool Evaluation",
    description: "Evaluates the creation of a new mock server",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please create a new mock server with workspace ID 'myWorkspace' and the mock configuration { name: 'testMock', endpoints: [{ method: 'GET', path: '/test' }] }");
        return JSON.parse(result);
    }
};

const getMockEval: EvalFunction = {
    name: 'getMockEval',
    description: 'Evaluates the getMock functionality for retrieving mock server details',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Retrieve the details of the mock server with ID 'test123' using getMock, and verify that the returned information is correct.");
        return JSON.parse(result);
    }
};

const updateMockEval: EvalFunction = {
    name: 'updateMock Tool Evaluation',
    description: 'Evaluates the functionality of updating an existing mock server',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please update the mock server with ID 42 to have a new name 'UpdatedServer' and a route '/updated-route'.");
        return JSON.parse(result);
    }
};

const deleteMockEval: EvalFunction = {
    name: 'DeleteMock Tool Evaluation',
    description: 'Evaluates the mock server deletion functionality',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please delete the mock server with the ID 12345.");
        return JSON.parse(result);
    }
};

const config: EvalConfig = {
    model: openai("gpt-4"),
    evals: [listMocksEval, createMockEval, getMockEval, updateMockEval, deleteMockEval]
};
  
export default config;
  
export const evals = [listMocksEval, createMockEval, getMockEval, updateMockEval, deleteMockEval];