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
    displayOptions: { show: { resource: ["folder"], operation: ["delete"] } },
    description: "The ID of the folder to delete",
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const client = await getDocumensoClient(this);

  const folderId = this.getNodeParameter("folderId", itemIndex) as string;

  try {
    return await client.folders.delete({ folderId });
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
