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
    description: "The ID of the document or template containing the files",
    displayOptions: {
      show: { resource: ["file"], operation: ["update"] },
    },
  },
  {
    displayName: "Files",
    name: "files",
    type: "fixedCollection",
    typeOptions: { multipleValues: true },
    required: true,
    default: {},
    placeholder: "Add File",
    displayOptions: {
      show: { resource: ["file"], operation: ["update"] },
    },
    options: [
      {
        displayName: "File",
        name: "file",
        values: [
          {
            displayName: "File ID",
            name: "fileId",
            type: "string",
            required: true,
            default: "",
            description: "The ID of the file to update",
          },
          {
            displayName: "Title",
            name: "title",
            type: "string",
            default: "",
            description: "New title for the file (leave empty to keep current)",
          },
          {
            displayName: "Order",
            name: "order",
            type: "number",
            default: 0,
            description: "New display order (0 to keep current)",
          },
        ],
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const documentId = this.getNodeParameter("documentId", itemIndex) as string;
  const filesData = this.getNodeParameter("files", itemIndex, {}) as {
    file?: Array<{
      fileId: string;
      title?: string;
      order?: number;
    }>;
  };

  const items = (filesData.file || []).map((f) => {
    const update: Record<string, any> = {
      envelopeItemId: f.fileId,
    };

    if (f.title) {
      update.title = f.title;
    }

    if (f.order) {
      update.order = f.order;
    }

    return update;
  });

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.items.updateMany({
      envelopeId: documentId,
      data: items as any,
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
