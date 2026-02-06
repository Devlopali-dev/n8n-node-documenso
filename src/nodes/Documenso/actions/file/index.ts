import type { INodeProperties } from "n8n-workflow";

import * as deleteOp from "./delete.operation";
import * as download from "./download.operation";
import * as update from "./update.operation";
import * as upload from "./upload.operation";

const operationProperty: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["file"],
    },
  },
  options: [
    {
      name: "Upload",
      value: "upload",
      description: "Upload files to a document or template",
      action: "Upload files to a document or template",
    },
    {
      name: "Download",
      value: "download",
      description: "Download a file",
      action: "Download a file",
    },
    {
      name: "Update",
      value: "update",
      description: "Update files on a document or template",
      action: "Update files",
    },
    {
      name: "Delete",
      value: "delete",
      description: "Delete a file from a document or template",
      action: "Delete a file",
    },
  ],
  default: "upload",
};

export const descriptions: INodeProperties[] = [
  operationProperty,
  ...upload.description,
  ...download.description,
  ...update.description,
  ...deleteOp.description,
];

export const operations = {
  upload: upload.execute,
  download: download.execute,
  update: update.execute,
  delete: deleteOp.execute,
};
