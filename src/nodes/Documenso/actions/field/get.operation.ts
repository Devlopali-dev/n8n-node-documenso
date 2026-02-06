import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
} from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "Field ID",
    name: "fieldId",
    type: "number",
    required: true,
    default: 0,
    description: "The ID of the field to retrieve",
    displayOptions: {
      show: {
        resource: ["field"],
        operation: ["get"],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const fieldId = this.getNodeParameter("fieldId", itemIndex) as number;

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.fields.get({ fieldId });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
