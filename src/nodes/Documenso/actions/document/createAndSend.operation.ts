import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
} from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "Title",
    name: "title",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: { resource: ["document"], operation: ["createAndSend"] },
    },
    description: "The title of the document",
  },
  {
    displayName: "Binary Property",
    name: "binaryPropertyName",
    type: "string",
    default: "data",
    displayOptions: {
      show: { resource: ["document"], operation: ["createAndSend"] },
    },
    description:
      "Name of the binary property containing the PDF file to upload",
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
      show: { resource: ["document"], operation: ["createAndSend"] },
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
  {
    displayName: "Signing Fields",
    name: "signingFields",
    type: "fixedCollection",
    typeOptions: { multipleValues: true },
    default: {},
    placeholder: "Add Signing Field",
    displayOptions: {
      show: { resource: ["document"], operation: ["createAndSend"] },
    },
    description:
      "Signature and form fields to place on the document. Each field is assigned to a recipient by email.",
    options: [
      {
        displayName: "Field",
        name: "field",
        values: [
          {
            displayName: "Recipient Email",
            name: "recipientEmail",
            type: "string",
            required: true,
            default: "",
            placeholder: "name@email.com",
            description:
              "The email of the recipient this field is assigned to (must match a recipient above)",
          },
          {
            displayName: "Type",
            name: "type",
            type: "options",
            required: true,
            default: "SIGNATURE",
            options: [
              { name: "Signature", value: "SIGNATURE" },
              { name: "Free Signature", value: "FREE_SIGNATURE" },
              { name: "Initials", value: "INITIALS" },
              { name: "Name", value: "NAME" },
              { name: "Email", value: "EMAIL" },
              { name: "Date", value: "DATE" },
              { name: "Text", value: "TEXT" },
              { name: "Number", value: "NUMBER" },
              { name: "Checkbox", value: "CHECKBOX" },
              { name: "Dropdown", value: "DROPDOWN" },
              { name: "Radio", value: "RADIO" },
            ],
          },
          {
            displayName: "Positioning",
            name: "positioning",
            type: "options",
            default: "placeholder",
            options: [
              {
                name: "Placeholder Text",
                value: "placeholder",
                description: "Match text in the PDF and place the field there",
              },
              {
                name: "Coordinates",
                value: "coordinates",
                description: "Specify exact page coordinates",
              },
            ],
          },
          {
            displayName: "Placeholder Text",
            name: "placeholder",
            type: "string",
            default: "",
            placeholder: "{{signature}}",
            description:
              "Text to find in the PDF. The field will be placed at its location.",
            displayOptions: {
              show: { positioning: ["placeholder"] },
            },
          },
          {
            displayName: "Match All Occurrences",
            name: "matchAll",
            type: "boolean",
            default: false,
            description:
              "Whether to place a field at every occurrence of the placeholder text",
            displayOptions: {
              show: { positioning: ["placeholder"] },
            },
          },
          {
            displayName: "Page",
            name: "page",
            type: "number",
            default: 1,
            description: "Page number (starting from 1)",
            displayOptions: {
              show: { positioning: ["coordinates"] },
            },
          },
          {
            displayName: "X (%)",
            name: "positionX",
            type: "number",
            default: 0,
            description:
              "Horizontal position as a percentage of page width (0–100)",
            displayOptions: {
              show: { positioning: ["coordinates"] },
            },
          },
          {
            displayName: "Y (%)",
            name: "positionY",
            type: "number",
            default: 0,
            description:
              "Vertical position as a percentage of page height (0–100)",
            displayOptions: {
              show: { positioning: ["coordinates"] },
            },
          },
          {
            displayName: "Width (%)",
            name: "width",
            type: "number",
            default: 15,
            description: "Width as a percentage of page width (0–100)",
            displayOptions: {
              show: { positioning: ["coordinates"] },
            },
          },
          {
            displayName: "Height (%)",
            name: "height",
            type: "number",
            default: 5,
            description: "Height as a percentage of page height (0–100)",
            displayOptions: {
              show: { positioning: ["coordinates"] },
            },
          },
        ],
      },
    ],
  },
  {
    displayName: "Email Subject",
    name: "subject",
    type: "string",
    default: "",
    displayOptions: {
      show: { resource: ["document"], operation: ["createAndSend"] },
    },
    description: "Custom email subject for the signing request",
  },
  {
    displayName: "Email Message",
    name: "message",
    type: "string",
    typeOptions: { rows: 4 },
    default: "",
    displayOptions: {
      show: { resource: ["document"], operation: ["createAndSend"] },
    },
    description: "Custom email message for the signing request",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: { resource: ["document"], operation: ["createAndSend"] },
    },
    options: [
      {
        displayName: "External ID",
        name: "externalId",
        type: "string",
        default: "",
        description: "An external identifier for the document",
      },
      {
        displayName: "Folder ID",
        name: "folderId",
        type: "string",
        default: "",
        description: "The folder to place the document in",
      },
      {
        displayName: "Redirect URL",
        name: "redirectUrl",
        type: "string",
        default: "",
        description: "URL to redirect recipients to after signing",
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const client = await getDocumensoClient(this);

  const title = this.getNodeParameter("title", itemIndex) as string;
  const binaryPropertyName = this.getNodeParameter(
    "binaryPropertyName",
    itemIndex,
  ) as string;
  const recipientsData = this.getNodeParameter("recipients", itemIndex, {}) as {
    recipient?: Array<{
      email: string;
      name: string;
      role: string;
      signingOrder?: number;
    }>;
  };
  const fieldsData = this.getNodeParameter("signingFields", itemIndex, {}) as {
    field?: Array<{
      recipientEmail: string;
      type: string;
      positioning: string;
      placeholder?: string;
      matchAll?: boolean;
      page?: number;
      positionX?: number;
      positionY?: number;
      width?: number;
      height?: number;
    }>;
  };
  const subject = this.getNodeParameter("subject", itemIndex, "") as string;
  const message = this.getNodeParameter("message", itemIndex, "") as string;
  const additionalFields = this.getNodeParameter(
    "additionalFields",
    itemIndex,
    {},
  ) as Record<string, any>;

  // Group fields by recipient email
  const fieldsByEmail: Record<string, any[]> = {};

  for (const f of fieldsData.field || []) {
    if (!fieldsByEmail[f.recipientEmail]) {
      fieldsByEmail[f.recipientEmail] = [];
    }
    const fieldDef: Record<string, any> = { type: f.type };

    if (f.positioning === "placeholder") {
      fieldDef.placeholder = f.placeholder;

      if (f.matchAll) {
        fieldDef.matchAll = f.matchAll;
      }
    } else {
      fieldDef.page = f.page;
      fieldDef.positionX = f.positionX;
      fieldDef.positionY = f.positionY;
      fieldDef.width = f.width;
      fieldDef.height = f.height;
    }
    fieldsByEmail[f.recipientEmail].push(fieldDef);
  }

  // Build recipients with inline fields
  const recipients = (recipientsData.recipient || []).map((r) => ({
    email: r.email as "" | string,
    name: r.name,
    role: r.role as "SIGNER" | "APPROVER" | "CC" | "VIEWER" | "ASSISTANT",
    ...(r.signingOrder ? { signingOrder: r.signingOrder } : {}),
    ...(fieldsByEmail[r.email] ? { fields: fieldsByEmail[r.email] } : {}),
  }));

  try {
    // Step 1: Create the document with inline recipients
    const binaryData = this.helpers.assertBinaryData(
      itemIndex,
      binaryPropertyName,
    );
    const buffer = await this.helpers.getBinaryDataBuffer(
      itemIndex,
      binaryPropertyName,
    );
    const file = new Blob([buffer], {
      type: binaryData.mimeType || "application/pdf",
    });

    const createResponse = await client.envelopes.create({
      payload: {
        title,
        type: "DOCUMENT",
        recipients,
        ...(additionalFields.externalId
          ? { externalId: additionalFields.externalId }
          : {}),
        ...(additionalFields.folderId
          ? { folderId: additionalFields.folderId }
          : {}),
        meta: {
          ...(subject ? { subject } : {}),
          ...(message ? { message } : {}),
          ...(additionalFields.redirectUrl
            ? { redirectUrl: additionalFields.redirectUrl }
            : {}),
        },
      },
      files: [
        {
          fileName: binaryData.fileName || "document.pdf",
          content: file,
        },
      ],
    });

    // Step 2: Immediately distribute (send for signing)
    const envelopeId = createResponse.id;

    const distributeResponse = await client.envelopes.distribute({
      envelopeId: String(envelopeId),
    });

    return {
      ...distributeResponse,
      documentId: String(envelopeId),
    };
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
