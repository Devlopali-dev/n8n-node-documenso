import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
} from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "Name",
    name: "name",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["folder"], operation: ["create"] } },
    description: "The name of the folder",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["folder"], operation: ["create"] } },
    options: [
      {
        displayName: "Parent Folder ID",
        name: "parentId",
        type: "string",
        default: "",
        description: "ID of the parent folder",
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const client = await getDocumensoClient(this);

  const name = this.getNodeParameter("name", itemIndex) as string;
  const additionalFields = this.getNodeParameter(
    "additionalFields",
    itemIndex,
    {},
  ) as Record<string, any>;

  try {
    return await client.folders.create({
      name,
      ...(additionalFields.parentId
        ? { parentId: additionalFields.parentId }
        : {}),
    });
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
