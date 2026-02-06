import type { INodeProperties } from "n8n-workflow";
import * as create from "./create.operation";
import * as deleteOp from "./delete.operation";
import * as get from "./get.operation";
import * as update from "./update.operation";

const operationProperty: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["field"],
    },
  },
  options: [
    {
      name: "Create",
      value: "create",
      description: "Create fields on a document or template",
      action: "Create fields",
    },
    {
      name: "Delete",
      value: "delete",
      description: "Delete a field",
      action: "Delete a field",
    },
    {
      name: "Get",
      value: "get",
      description: "Get a field by ID",
      action: "Get a field",
    },
    {
      name: "Update",
      value: "update",
      description: "Update fields on a document or template",
      action: "Update fields",
    },
  ],
  default: "create",
};

export const descriptions: INodeProperties[] = [
  operationProperty,
  ...get.description,
  ...create.description,
  ...update.description,
  ...deleteOp.description,
];

export const operations = {
  get: get.execute,
  create: create.execute,
  update: update.execute,
  delete: deleteOp.execute,
};
