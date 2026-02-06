import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import * as create from "./create.operation";
import * as del from "./delete.operation";
import * as find from "./find.operation";
import * as update from "./update.operation";

export const descriptions: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: { show: { resource: ["folder"] } },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create a folder",
        description: "Create a new folder",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete a folder",
        description: "Delete a folder",
      },
      {
        name: "Find",
        value: "find",
        action: "Find folders",
        description: "Search for folders",
      },
      {
        name: "Update",
        value: "update",
        action: "Update a folder",
        description: "Update a folder",
      },
    ],
    default: "find",
  },
  ...find.description,
  ...create.description,
  ...update.description,
  ...del.description,
];

export const operations: Record<
  string,
  (this: IExecuteFunctions, itemIndex: number) => Promise<any>
> = {
  find: find.execute,
  create: create.execute,
  update: update.execute,
  delete: del.execute,
};
