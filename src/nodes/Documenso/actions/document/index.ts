import type { INodeProperties } from "n8n-workflow";
import * as create from "./create.operation";
import * as createAndSend from "./createAndSend.operation";
import * as deleteOp from "./delete.operation";
import * as download from "./download.operation";
import * as duplicate from "./duplicate.operation";
import * as find from "./find.operation";
import * as get from "./get.operation";
import * as resend from "./resend.operation";
import * as send from "./send.operation";
import * as update from "./update.operation";

const operationProperty: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["document"],
    },
  },
  options: [
    {
      name: "Create",
      value: "create",
      description: "Create a new document",
      action: "Create a document",
    },
    {
      name: "Create and Send",
      value: "createAndSend",
      description:
        "Create a document with recipients and immediately send for signing",
      action: "Create and send a document",
    },
    {
      name: "Delete",
      value: "delete",
      description: "Delete a document",
      action: "Delete a document",
    },
    {
      name: "Download",
      value: "download",
      description: "Download a document PDF",
      action: "Download a document PDF",
    },
    {
      name: "Duplicate",
      value: "duplicate",
      description: "Duplicate a document",
      action: "Duplicate a document",
    },
    {
      name: "Find",
      value: "find",
      description: "Find documents",
      action: "Find documents",
    },
    {
      name: "Get",
      value: "get",
      description: "Get a document by ID",
      action: "Get a document",
    },
    {
      name: "Resend",
      value: "resend",
      description: "Resend a document to recipients",
      action: "Resend a document to recipients",
    },
    {
      name: "Send",
      value: "send",
      description: "Send a document for signing",
      action: "Send a document for signing",
    },
    {
      name: "Update",
      value: "update",
      description: "Update a document",
      action: "Update a document",
    },
  ],
  default: "find",
};

export const descriptions: INodeProperties[] = [
  operationProperty,
  ...get.description,
  ...find.description,
  ...create.description,
  ...createAndSend.description,
  ...update.description,
  ...deleteOp.description,
  ...duplicate.description,
  ...download.description,
  ...send.description,
  ...resend.description,
];

export const operations = {
  get: get.execute,
  find: find.execute,
  create: create.execute,
  createAndSend: createAndSend.execute,
  update: update.execute,
  delete: deleteOp.execute,
  duplicate: duplicate.execute,
  download: download.execute,
  send: send.execute,
  resend: resend.execute,
};
