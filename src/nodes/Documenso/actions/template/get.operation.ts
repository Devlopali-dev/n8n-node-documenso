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
    description: "The ID of the template to retrieve",
    displayOptions: {
      show: {
        resource: ["template"],
        operation: ["get"],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const templateId = this.getNodeParameter("templateId", itemIndex) as string;

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.get({ envelopeId: templateId });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
