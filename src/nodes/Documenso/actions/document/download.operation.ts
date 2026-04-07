import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
  sanitizeFilename,
} from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "Document ID",
    name: "documentId",
    type: "string",
    required: true,
    default: "",
    description: "The ID of the document to download",
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["download"],
      },
    },
  },
  {
    displayName: "Binary Property",
    name: "binaryPropertyName",
    type: "string",
    default: "data",
    description:
      "The name of the binary property to write the downloaded file to",
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["download"],
      },
    },
  },
  {
    displayName: "Version",
    name: "version",
    type: "options",
    options: [
      { name: "Signed", value: "signed" },
      { name: "Original", value: "original" },
    ],
    default: "signed",
    description: "Which version of the document to download",
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["download"],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const documentId = this.getNodeParameter("documentId", itemIndex)!.toString();

  const binaryPropertyName = this.getNodeParameter(
    "binaryPropertyName",
    itemIndex,
  ) as string;

  const version = this.getNodeParameter("version", itemIndex)!.toString();

  try {
    const client = await getDocumensoClient(this);

    const envelope = await client.envelopes.get({ envelopeId: documentId });

    if (!envelope.envelopeItems?.length) {
      throw new NodeOperationError(
        this.getNode(),
        `Document ${documentId} has no downloadable items`,
        { itemIndex },
      );
    }

    const itemId = envelope.envelopeItems[0].id;

    const response = await client.envelopes.items.download({
      envelopeItemId: itemId,
      version: version as "signed" | "original",
    });

    let buffer: Buffer;

    const result = response.result;

    if (result instanceof ArrayBuffer) {
      buffer = Buffer.from(new Uint8Array(result));
    } else if (result instanceof Uint8Array) {
      buffer = Buffer.from(result);
    } else if (
      result &&
      typeof result === "object" &&
      typeof (result as any).arrayBuffer === "function"
    ) {
      buffer = Buffer.from(await (result as any).arrayBuffer());
    } else if (typeof result === "string") {
      buffer = Buffer.from(result, "base64");
    } else {
      buffer = Buffer.from(JSON.stringify(result));
    }

    const headers = response.headers as unknown as Record<string, string>;
    const contentType = headers?.["content-type"] ?? "application/pdf";
    const contentDisposition = headers?.["content-disposition"] ?? "";
    const fileNameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
    const rawFileName = fileNameMatch?.[1] ?? "";
    const fileName = sanitizeFilename(
      rawFileName,
      `document-${documentId}.pdf`,
    );

    const binaryData = await this.helpers.prepareBinaryData(
      buffer,
      fileName,
      contentType,
    );

    return { binary: { [binaryPropertyName]: binaryData } };
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
