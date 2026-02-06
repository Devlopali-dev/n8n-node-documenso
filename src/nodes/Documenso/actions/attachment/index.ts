import type { INodeProperties } from "n8n-workflow";
import * as create from "./create.operation";
import * as deleteOp from "./delete.operation";
import * as find from "./find.operation";
import * as update from "./update.operation";

const operationProperty: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["attachment"],
    },
  },
  options: [
    {
      name: "Create",
      value: "create",
      description: "Create an attachment on a document or template",
      action: "Create an attachment",
    },
    {
      name: "Delete",
      value: "delete",
      description: "Delete an attachment",
      action: "Delete an attachment",
    },
    {
      name: "Find",
      value: "find",
      description: "Find attachments on a document or template",
      action: "Find attachments",
    },
    {
      name: "Update",
      value: "update",
      description: "Update an attachment",
      action: "Update an attachment",
    },
  ],
  default: "find",
};

export const descriptions: INodeProperties[] = [
  operationProperty,
  ...find.description,
  ...create.description,
  ...update.description,
  ...deleteOp.description,
];

export const operations = {
  find: find.execute,
  create: create.execute,
  update: update.execute,
  delete: deleteOp.execute,
};
