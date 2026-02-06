import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
} from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "Attachment ID",
    name: "attachmentId",
    type: "string",
    required: true,
    default: "",
    description: "The ID of the attachment to update",
    displayOptions: {
      show: {
        resource: ["attachment"],
        operation: ["update"],
      },
    },
  },
  {
    displayName: "Label",
    name: "label",
    type: "string",
    required: true,
    default: "",
    description: "The new label for the attachment",
    displayOptions: {
      show: {
        resource: ["attachment"],
        operation: ["update"],
      },
    },
  },
  {
    displayName: "URL",
    name: "data",
    type: "string",
    required: true,
    default: "",
    description: "The new URL link for the attachment",
    displayOptions: {
      show: {
        resource: ["attachment"],
        operation: ["update"],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const attachmentId = this.getNodeParameter(
    "attachmentId",
    itemIndex,
  ) as string;
  const label = this.getNodeParameter("label", itemIndex) as string;
  const data = this.getNodeParameter("data", itemIndex) as string;

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.attachments.update({
      id: attachmentId,
      data: { label, data },
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
