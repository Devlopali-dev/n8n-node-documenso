import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
} from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "Document/Template ID",
    name: "documentId",
    type: "string",
    required: true,
    default: "",
    description: "The ID of the document or template containing the file",
    displayOptions: {
      show: {
        resource: ["file"],
        operation: ["delete"],
      },
    },
  },
  {
    displayName: "File ID",
    name: "fileId",
    type: "string",
    required: true,
    default: "",
    description: "The ID of the file to delete",
    displayOptions: {
      show: {
        resource: ["file"],
        operation: ["delete"],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const documentId = this.getNodeParameter("documentId", itemIndex) as string;
  const fileId = this.getNodeParameter("fileId", itemIndex) as string;

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.items.delete({
      envelopeId: documentId,
      envelopeItemId: fileId,
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
