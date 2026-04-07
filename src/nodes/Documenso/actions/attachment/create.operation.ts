import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
} from "../../GenericFunctions";

const ALLOWED_ATTACHMENT_SCHEMES = ["https:", "http:"];

function validateAttachmentUrl(url: string, context: IExecuteFunctions): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new NodeOperationError(
      context.getNode(),
      "Invalid URL format for attachment",
    );
  }
  if (!ALLOWED_ATTACHMENT_SCHEMES.includes(parsed.protocol)) {
    throw new NodeOperationError(
      context.getNode(),
      "Attachment URL must use http or https scheme",
    );
  }
  // Block private/loopback addresses to prevent SSRF
  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.16.") ||
    hostname.startsWith("172.17.") ||
    hostname.startsWith("172.18.") ||
    hostname.startsWith("172.19.") ||
    hostname.startsWith("172.2") ||
    hostname.startsWith("172.30.") ||
    hostname.startsWith("172.31.") ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new NodeOperationError(
      context.getNode(),
      "Attachment URL must not point to a private or loopback address",
    );
  }
}

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
    name: "url",
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
  const url = this.getNodeParameter("url", itemIndex) as string;

  validateAttachmentUrl(url, this);

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.attachments.create({
      envelopeId: documentId,
      data: { label, data: url },
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
