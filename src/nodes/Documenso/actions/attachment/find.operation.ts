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
    description: "The ID of the document or template to find attachments for",
    displayOptions: {
      show: {
        resource: ["attachment"],
        operation: ["find"],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const documentId = this.getNodeParameter("documentId", itemIndex) as string;

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.attachments.find({
      envelopeId: documentId,
    });

    return response.data;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
