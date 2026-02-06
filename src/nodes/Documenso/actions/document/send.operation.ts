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
    description: "The ID of the document to send for signing",
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["send"],
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
        operation: ["send"],
      },
    },
    options: [
      {
        displayName: "Subject",
        name: "subject",
        type: "string",
        default: "",
        description: "The email subject line for the signing request",
      },
      {
        displayName: "Message",
        name: "message",
        type: "string",
        default: "",
        description: "The email message body for the signing request",
      },
      {
        displayName: "Distribution Method",
        name: "distributionMethod",
        type: "options",
        options: [
          { name: "Email", value: "EMAIL" },
          { name: "None", value: "NONE" },
        ],
        default: "EMAIL",
        description: "The method used to distribute the document",
      },
      {
        displayName: "Redirect URL",
        name: "redirectUrl",
        type: "string",
        default: "",
        description: "The URL to redirect recipients to after signing",
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const documentId = this.getNodeParameter("documentId", itemIndex) as string;
  const additionalFields = this.getNodeParameter(
    "additionalFields",
    itemIndex,
    {},
  ) as Record<string, any>;

  try {
    const client = await getDocumensoClient(this);

    const meta: Record<string, any> = {};

    if (additionalFields.subject) {
      meta.subject = additionalFields.subject;
    }

    if (additionalFields.message) {
      meta.message = additionalFields.message;
    }

    if (additionalFields.distributionMethod) {
      meta.distributionMethod = additionalFields.distributionMethod;
    }

    if (additionalFields.redirectUrl) {
      meta.redirectUrl = additionalFields.redirectUrl;
    }

    const response = await client.envelopes.distribute({
      envelopeId: documentId,
      ...(Object.keys(meta).length > 0 ? { meta } : {}),
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
