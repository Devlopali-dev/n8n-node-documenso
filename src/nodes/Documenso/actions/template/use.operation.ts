import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
} from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "Template ID",
    name: "templateId",
    type: "string",
    required: true,
    default: "",
    description: "The ID of the template to create a document from",
    displayOptions: {
      show: {
        resource: ["template"],
        operation: ["use"],
      },
    },
  },
  {
    displayName: "Send After Creation",
    name: "sendAfterCreation",
    type: "boolean",
    default: false,
    description:
      "Automatically send the document for signing after creating it from the template",
    displayOptions: {
      show: {
        resource: ["template"],
        operation: ["use"],
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
        resource: ["template"],
        operation: ["use"],
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
            description: "The template recipient ID to override",
          },
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
            default: "",
          },
          {
            displayName: "Signing Order",
            name: "signingOrder",
            type: "number",
            default: 0,
          },
        ],
      },
    ],
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["template"],
        operation: ["use"],
      },
    },
    options: [
      {
        displayName: "External ID",
        name: "externalId",
        type: "string",
        default: "",
        description: "An external ID to associate with the created document",
      },
      {
        displayName: "Folder ID",
        name: "folderId",
        type: "string",
        default: "",
        description: "The ID of the folder to place the created document in",
      },
      {
        displayName: "Title",
        name: "title",
        type: "string",
        default: "",
        description: "Override the title of the created document",
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const templateId = this.getNodeParameter("templateId", itemIndex) as string;
  const sendAfterCreation = this.getNodeParameter(
    "sendAfterCreation",
    itemIndex,
  ) as boolean;
  const recipientsData = this.getNodeParameter("recipients", itemIndex, {}) as {
    recipient?: Array<{
      id: number;
      email: string;
      name?: string;
      signingOrder?: number;
    }>;
  };
  const recipients = recipientsData.recipient || [];
  const additionalFields = this.getNodeParameter(
    "additionalFields",
    itemIndex,
    {},
  ) as Record<string, any>;

  try {
    const client = await getDocumensoClient(this);

    const payload: {
      envelopeId: string;
      recipients?: Array<{
        id: number;
        email: string;
        name?: string;
        signingOrder?: number;
      }>;
      distributeDocument?: boolean;
      externalId?: string;
      folderId?: string;
      override?: { title?: string };
    } = {
      envelopeId: templateId,
    };

    if (recipients.length > 0) {
      payload.recipients = recipients;
    }

    payload.distributeDocument = sendAfterCreation;

    if (additionalFields.externalId) {
      payload.externalId = additionalFields.externalId;
    }

    if (additionalFields.folderId) {
      payload.folderId = additionalFields.folderId;
    }

    if (additionalFields.title) {
      payload.override = { title: additionalFields.title };
    }

    const response = await client.envelopes.use({ payload });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
