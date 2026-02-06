import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
} from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "Document ID",
    name: "documentId",
    type: "string",
    required: true,
    default: "",
    description: "The ID of the document to update",
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["update"],
      },
    },
  },
  {
    displayName: "Update Fields",
    name: "updateFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["update"],
      },
    },
    options: [
      {
        displayName: "Title",
        name: "title",
        type: "string",
        default: "",
        description: "The new title for the document",
      },
      {
        displayName: "External ID",
        name: "externalId",
        type: "string",
        default: "",
        description: "An external ID to associate with the document",
      },
      {
        displayName: "Folder ID",
        name: "folderId",
        type: "string",
        default: "",
        description: "The ID of the folder to move the document to",
      },
      {
        displayName: "Visibility",
        name: "visibility",
        type: "options",
        options: [
          { name: "Everyone", value: "EVERYONE" },
          { name: "Manager and Above", value: "MANAGER_AND_ABOVE" },
          { name: "Admin", value: "ADMIN" },
        ],
        default: "EVERYONE",
        description: "The visibility level of the document",
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const documentId = this.getNodeParameter("documentId", itemIndex) as string;
  const updateFields = this.getNodeParameter(
    "updateFields",
    itemIndex,
    {},
  ) as Record<string, any>;

  try {
    const client = await getDocumensoClient(this);

    const data: Record<string, any> = {};

    if (updateFields.title) {
      data.title = updateFields.title;
    }

    if (updateFields.externalId) {
      data.externalId = updateFields.externalId;
    }

    if (updateFields.folderId) {
      data.folderId = updateFields.folderId;
    }

    if (updateFields.visibility) {
      data.visibility = updateFields.visibility;
    }

    const response = await client.envelopes.update({
      envelopeId: documentId,
      data,
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
