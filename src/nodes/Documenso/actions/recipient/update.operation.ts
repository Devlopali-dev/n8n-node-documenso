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
    description: "The ID of the document or template containing the recipients",
    displayOptions: {
      show: { resource: ["recipient"], operation: ["update"] },
    },
  },
  {
    displayName: "Recipients",
    name: "recipients",
    type: "fixedCollection",
    typeOptions: { multipleValues: true },
    required: true,
    default: {},
    placeholder: "Add Recipient",
    displayOptions: {
      show: { resource: ["recipient"], operation: ["update"] },
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
            description: "The ID of the recipient to update",
          },
          {
            displayName: "Email",
            name: "email",
            type: "string",
            default: "",
            placeholder: "name@email.com",
            description: "New email address (leave empty to keep current)",
          },
          {
            displayName: "Name",
            name: "name",
            type: "string",
            default: "",
            description: "New name (leave empty to keep current)",
          },
          {
            displayName: "Role",
            name: "role",
            type: "options",
            default: "",
            options: [
              { name: "No Change", value: "" },
              { name: "Signer", value: "SIGNER" },
              { name: "Approver", value: "APPROVER" },
              { name: "CC", value: "CC" },
              { name: "Viewer", value: "VIEWER" },
              { name: "Assistant", value: "ASSISTANT" },
            ],
            description: "New role (select No Change to keep current)",
          },
          {
            displayName: "Signing Order",
            name: "signingOrder",
            type: "number",
            default: 0,
            description: "New signing order (0 to keep current)",
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
      id: number;
      email?: string;
      name?: string;
      role?: string;
      signingOrder?: number;
    }>;
  };

  const recipients = (recipientsData.recipient || []).map((r) => {
    const update: Record<string, any> = { id: r.id };

    if (r.email) {
      update.email = r.email;
    }

    if (r.name) {
      update.name = r.name;
    }

    if (r.role) {
      update.role = r.role;
    }

    if (r.signingOrder) {
      update.signingOrder = r.signingOrder;
    }

    return update;
  });

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.recipients.updateMany({
      envelopeId: documentId,
      data: recipients as any,
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
