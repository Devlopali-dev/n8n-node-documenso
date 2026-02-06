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
      resource: ["recipient"],
    },
  },
  options: [
    {
      name: "Create",
      value: "create",
      description: "Create recipients on a document or template",
      action: "Create recipients",
    },
    {
      name: "Delete",
      value: "delete",
      description: "Delete a recipient",
      action: "Delete a recipient",
    },
    {
      name: "Get",
      value: "get",
      description: "Get a recipient by ID",
      action: "Get a recipient",
    },
    {
      name: "Update",
      value: "update",
      description: "Update recipients on a document or template",
      action: "Update recipients",
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
