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
    description: "The ID of the document or template containing the fields",
    displayOptions: {
      show: { resource: ["field"], operation: ["update"] },
    },
  },
  {
    displayName: "Fields",
    name: "fields",
    type: "fixedCollection",
    typeOptions: { multipleValues: true },
    required: true,
    default: {},
    placeholder: "Add Field",
    displayOptions: {
      show: { resource: ["field"], operation: ["update"] },
    },
    options: [
      {
        displayName: "Field",
        name: "field",
        values: [
          {
            displayName: "Field ID",
            name: "id",
            type: "number",
            required: true,
            default: 0,
            description: "The ID of the field to update",
          },
          {
            displayName: "Page",
            name: "page",
            type: "number",
            default: 0,
            description: "New page number (0 to keep current)",
          },
          {
            displayName: "X (%)",
            name: "positionX",
            type: "number",
            default: 0,
            description:
              "New horizontal position as a percentage of page width (0 to keep current)",
          },
          {
            displayName: "Y (%)",
            name: "positionY",
            type: "number",
            default: 0,
            description:
              "New vertical position as a percentage of page height (0 to keep current)",
          },
          {
            displayName: "Width (%)",
            name: "width",
            type: "number",
            default: 0,
            description:
              "New width as a percentage of page width (0 to keep current)",
          },
          {
            displayName: "Height (%)",
            name: "height",
            type: "number",
            default: 0,
            description:
              "New height as a percentage of page height (0 to keep current)",
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
  const fieldsData = this.getNodeParameter("fields", itemIndex, {}) as {
    field?: Array<{
      id: number;
      page?: number;
      positionX?: number;
      positionY?: number;
      width?: number;
      height?: number;
    }>;
  };

  const fields = (fieldsData.field || []).map((f) => {
    const update: Record<string, any> = { id: f.id };

    if (f.page) {
      update.page = f.page;
    }

    if (f.positionX) {
      update.positionX = f.positionX;
    }

    if (f.positionY) {
      update.positionY = f.positionY;
    }

    if (f.width) {
      update.width = f.width;
    }

    if (f.height) {
      update.height = f.height;
    }

    return update;
  });

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.fields.updateMany({
      envelopeId: documentId,
      data: fields as any,
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
