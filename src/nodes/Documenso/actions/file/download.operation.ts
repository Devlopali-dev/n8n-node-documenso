import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
  sanitizeFilename,
} from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "File ID",
    name: "fileId",
    type: "string",
    required: true,
    default: "",
    description: "The ID of the file to download",
    displayOptions: {
      show: {
        resource: ["file"],
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
        resource: ["file"],
        operation: ["download"],
      },
    },
  },
  {
    displayName: "Version",
    name: "version",
    type: "options",
    options: [
      { name: "Original", value: "original" },
      { name: "Signed", value: "signed" },
    ],
    default: "signed",
    description: "Which version of the file to download",
    displayOptions: {
      show: {
        resource: ["file"],
        operation: ["download"],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const fileId = this.getNodeParameter("fileId", itemIndex) as string;
  const binaryPropertyName = this.getNodeParameter(
    "binaryPropertyName",
    itemIndex,
  ) as string;
  const version = this.getNodeParameter("version", itemIndex) as string;

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.items.download({
      envelopeItemId: fileId,
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
    const fileName = sanitizeFilename(rawFileName, `file-${fileId}.pdf`);

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
