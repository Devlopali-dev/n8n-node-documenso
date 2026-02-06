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
    description: "The ID of the document to resend to recipients",
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["resend"],
      },
    },
  },
  {
    displayName: "Recipients",
    name: "recipientIds",
    type: "fixedCollection",
    typeOptions: { multipleValues: true },
    required: true,
    default: {},
    placeholder: "Add Recipient",
    description: "The recipients to resend the document to",
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["resend"],
      },
    },
    options: [
      {
        displayName: "Recipient",
        name: "recipient",
        values: [
          {
            displayName: "Recipient ID",
            name: "id",
            type: "number",
            required: true,
            default: 0,
            description: "The ID of the recipient to resend to",
          },
        ],
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const documentId = this.getNodeParameter("documentId", itemIndex) as string;
  const recipientsData = this.getNodeParameter(
    "recipientIds",
    itemIndex,
    {},
  ) as {
    recipient?: Array<{ id: number }>;
  };

  const recipients = (recipientsData.recipient || []).map((r) => r.id);

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.redistribute({
      envelopeId: documentId,
      recipients,
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
