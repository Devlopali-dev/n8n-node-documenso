import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
} from "../../GenericFunctions";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export const description: INodeProperties[] = [
  {
    displayName: "Title",
    name: "title",
    type: "string",
    required: true,
    default: "",
    description: "The title of the document",
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["create"],
      },
    },
  },
  {
    displayName: "Binary Property",
    name: "binaryPropertyName",
    type: "string",
    default: "data",
    description:
      "The name of the binary property containing the file to upload",
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["create"],
      },
    },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["create"],
      },
    },
    options: [
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
        description: "The ID of the folder to place the document in",
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
  const title = this.getNodeParameter("title", itemIndex) as string;
  const binaryPropertyName = this.getNodeParameter(
    "binaryPropertyName",
    itemIndex,
  ) as string;
  const additionalFields = this.getNodeParameter(
    "additionalFields",
    itemIndex,
    {},
  ) as Record<string, any>;

  try {
    const client = await getDocumensoClient(this);

    const binaryData = this.helpers.assertBinaryData(
      itemIndex,
      binaryPropertyName,
    );

    const buffer = await this.helpers.getBinaryDataBuffer(
      itemIndex,
      binaryPropertyName,
    );

    if (buffer.length > MAX_FILE_SIZE) {
      throw new NodeOperationError(
        this.getNode(),
        `File size (${Math.round(buffer.length / 1024 / 1024)} MB) exceeds the maximum allowed size of 50 MB`,
        { itemIndex },
      );
    }

    const blob = new Blob([buffer], {
      type: binaryData.mimeType || "application/pdf",
    });

    const payload: {
      title: string;
      type: "DOCUMENT";
      externalId?: string;
      folderId?: string;
      visibility?: "EVERYONE" | "MANAGER_AND_ABOVE" | "ADMIN";
    } = {
      title,
      type: "DOCUMENT",
    };

    if (additionalFields.externalId) {
      payload.externalId = additionalFields.externalId;
    }

    if (additionalFields.folderId) {
      payload.folderId = additionalFields.folderId;
    }

    if (additionalFields.visibility) {
      payload.visibility = additionalFields.visibility;
    }

    const response = await client.envelopes.create({
      payload,
      files: [
        {
          fileName: binaryData.fileName || "document.pdf",
          content: blob,
        },
      ],
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
