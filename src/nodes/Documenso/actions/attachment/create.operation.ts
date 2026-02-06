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
    description: "The ID of the document or template to add the attachment to",
    displayOptions: {
      show: {
        resource: ["attachment"],
        operation: ["create"],
      },
    },
  },
  {
    displayName: "Label",
    name: "label",
    type: "string",
    required: true,
    default: "",
    description: "The label for the attachment",
    displayOptions: {
      show: {
        resource: ["attachment"],
        operation: ["create"],
      },
    },
  },
  {
    displayName: "URL",
    name: "data",
    type: "string",
    required: true,
    default: "",
    description: "The URL link for the attachment",
    displayOptions: {
      show: {
        resource: ["attachment"],
        operation: ["create"],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const documentId = this.getNodeParameter("documentId", itemIndex) as string;
  const label = this.getNodeParameter("label", itemIndex) as string;
  const data = this.getNodeParameter("data", itemIndex) as string;

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.attachments.create({
      envelopeId: documentId,
      data: { label, data },
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
