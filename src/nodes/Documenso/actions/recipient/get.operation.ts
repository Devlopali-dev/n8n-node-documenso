import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
} from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "Recipient ID",
    name: "recipientId",
    type: "number",
    required: true,
    default: 0,
    description: "The ID of the recipient to retrieve",
    displayOptions: {
      show: {
        resource: ["recipient"],
        operation: ["get"],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const recipientId = this.getNodeParameter("recipientId", itemIndex) as number;

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.recipients.get({ recipientId });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
