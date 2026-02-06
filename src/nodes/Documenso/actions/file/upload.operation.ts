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
    description: "The ID of the document or template to add files to",
    displayOptions: {
      show: {
        resource: ["file"],
        operation: ["upload"],
      },
    },
  },
  {
    displayName: "Binary Property",
    name: "binaryPropertyName",
    type: "string",
    default: "data",
    description:
      "The name of the binary property containing the file to upload",
    displayOptions: {
      show: {
        resource: ["file"],
        operation: ["upload"],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const documentId = this.getNodeParameter("documentId", itemIndex) as string;
  const binaryPropertyName = this.getNodeParameter(
    "binaryPropertyName",
    itemIndex,
  ) as string;

  try {
    const client = await getDocumensoClient(this);

    const binaryData = this.helpers.assertBinaryData(
      itemIndex,
      binaryPropertyName,
    );
    const buffer = await this.helpers.getBinaryDataBuffer(
      itemIndex,
      binaryPropertyName,
    );
    const blob = new Blob([buffer]);

    const response = await client.envelopes.items.createMany({
      payload: { envelopeId: documentId },
      files: [
        {
          fileName: binaryData.fileName || "document.pdf",
          content: blob,
        },
      ],
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
