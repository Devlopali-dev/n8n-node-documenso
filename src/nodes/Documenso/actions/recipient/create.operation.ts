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
    description: "The ID of the document or template to add recipients to",
    displayOptions: {
      show: {
        resource: ["recipient"],
        operation: ["create"],
      },
    },
  },
  {
    displayName: "Recipients",
    name: "recipients",
    type: "fixedCollection",
    typeOptions: { multipleValues: true },
    default: {},
    placeholder: "Add Recipient",
    displayOptions: {
      show: {
        resource: ["recipient"],
        operation: ["create"],
      },
    },
    options: [
      {
        displayName: "Recipient",
        name: "recipient",
        values: [
          {
            displayName: "Email",
            name: "email",
            type: "string",
            required: true,
            default: "",
            placeholder: "name@email.com",
          },
          {
            displayName: "Name",
            name: "name",
            type: "string",
            required: true,
            default: "",
          },
          {
            displayName: "Role",
            name: "role",
            type: "options",
            required: true,
            default: "SIGNER",
            options: [
              { name: "Signer", value: "SIGNER" },
              { name: "Approver", value: "APPROVER" },
              { name: "CC", value: "CC" },
              { name: "Viewer", value: "VIEWER" },
              { name: "Assistant", value: "ASSISTANT" },
            ],
          },
          {
            displayName: "Signing Order",
            name: "signingOrder",
            type: "number",
            default: 0,
            description: "Order for sequential signing (0 for parallel)",
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

  const recipientsData = this.getNodeParameter("recipients", itemIndex, {}) as {
    recipient?: Array<{
      email: string;
      name: string;
      role: string;
      signingOrder?: number;
    }>;
  };

  const recipients = (recipientsData.recipient || []).map((r) => ({
    ...r,
    email: r.email as "" | string,
  }));

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.recipients.createMany({
      envelopeId: documentId,
      data: recipients as any,
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
