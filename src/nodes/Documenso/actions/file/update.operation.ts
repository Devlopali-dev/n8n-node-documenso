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
            displayName: "Fields to Update",
            name: "updates",
            type: "collection",
            placeholder: "Add Property",
            default: {},
            description: "Only the properties you add here will be changed",
            options: [
              {
                displayName: "Title",
                name: "title",
                type: "string",
                default: "",
                description: "New title for the file",
              },
              {
                displayName: "Order",
                name: "order",
                type: "number",
                default: 0,
                typeOptions: { minValue: 0 },
                description: "New display order",
              },
            ],
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
      updates?: {
        title?: string;
        order?: number;
      };
    }>;
  };

  const items = (filesData.file || []).map((f) => {
    const update: Record<string, any> = { envelopeItemId: f.fileId };
    const updates = f.updates ?? {};

    if (updates.title !== undefined) {
      update.title = updates.title;
    }
    if (updates.order !== undefined) {
      update.order = updates.order;
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
