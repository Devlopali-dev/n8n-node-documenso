import type { INodeProperties } from "n8n-workflow";
import * as create from "./create.operation";
import * as deleteOp from "./delete.operation";
import * as duplicate from "./duplicate.operation";
import * as find from "./find.operation";
import * as get from "./get.operation";
import * as update from "./update.operation";
import * as use from "./use.operation";

const operationProperty: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["template"],
    },
  },
  options: [
    {
      name: "Create",
      value: "create",
      description: "Create a new template",
      action: "Create a template",
    },
    {
      name: "Delete",
      value: "delete",
      description: "Delete a template",
      action: "Delete a template",
    },
    {
      name: "Duplicate",
      value: "duplicate",
      description: "Duplicate a template",
      action: "Duplicate a template",
    },
    {
      name: "Find",
      value: "find",
      description: "Find templates",
      action: "Find templates",
    },
    {
      name: "Get",
      value: "get",
      description: "Get a template by ID",
      action: "Get a template",
    },
    {
      name: "Update",
      value: "update",
      description: "Update a template",
      action: "Update a template",
    },
    {
      name: "Use",
      value: "use",
      description: "Create a document from a template",
      action: "Use a template",
    },
  ],
  default: "find",
};

export const descriptions: INodeProperties[] = [
  operationProperty,
  ...get.description,
  ...find.description,
  ...create.description,
  ...update.description,
  ...deleteOp.description,
  ...duplicate.description,
  ...use.description,
];

export const operations = {
  get: get.execute,
  find: find.execute,
  create: create.execute,
  update: update.execute,
  delete: deleteOp.execute,
  duplicate: duplicate.execute,
  use: use.execute,
};
