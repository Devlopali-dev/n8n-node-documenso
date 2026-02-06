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
    description: "The ID of the attachment to delete",
    displayOptions: {
      show: {
        resource: ["attachment"],
        operation: ["delete"],
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

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.attachments.delete({
      id: attachmentId,
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
