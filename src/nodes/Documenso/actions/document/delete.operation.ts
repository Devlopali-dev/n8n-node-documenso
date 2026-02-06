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
    description: "The ID of the document to delete",
    displayOptions: {
      show: {
        resource: ["document"],
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

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.delete({ envelopeId: documentId });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
