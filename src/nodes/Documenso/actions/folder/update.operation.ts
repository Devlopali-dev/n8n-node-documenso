import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
} from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "Folder ID",
    name: "folderId",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["folder"], operation: ["update"] } },
    description: "The ID of the folder to update",
  },
  {
    displayName: "Update Fields",
    name: "updateFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["folder"], operation: ["update"] } },
    options: [
      {
        displayName: "Name",
        name: "name",
        type: "string",
        default: "",
        description: "New name for the folder",
      },
      {
        displayName: "Parent Folder ID",
        name: "parentId",
        type: "string",
        default: "",
        description: "Move folder to a different parent",
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const client = await getDocumensoClient(this);

  const folderId = this.getNodeParameter("folderId", itemIndex) as string;
  const updateFields = this.getNodeParameter(
    "updateFields",
    itemIndex,
    {},
  ) as Record<string, any>;

  const data: Record<string, any> = {};

  if (updateFields.name) {
    data.name = updateFields.name;
  }

  if (updateFields.parentId) {
    data.parentId = updateFields.parentId;
  }

  try {
    return await client.folders.update({ folderId, data });
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
