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
            displayName: "Fields to Update",
            name: "updates",
            type: "collection",
            placeholder: "Add Property",
            default: {},
            description: "Only the properties you add here will be changed",
            options: [
              {
                displayName: "Page",
                name: "page",
                type: "number",
                default: 1,
                typeOptions: { minValue: 1 },
                description: "New page number (starting from 1)",
              },
              {
                displayName: "X (%)",
                name: "positionX",
                type: "number",
                default: 0,
                typeOptions: { minValue: 0, maxValue: 100 },
                description: "New horizontal position as a percentage of page width (0–100)",
              },
              {
                displayName: "Y (%)",
                name: "positionY",
                type: "number",
                default: 0,
                typeOptions: { minValue: 0, maxValue: 100 },
                description: "New vertical position as a percentage of page height (0–100)",
              },
              {
                displayName: "Width (%)",
                name: "width",
                type: "number",
                default: 15,
                typeOptions: { minValue: 0, maxValue: 100 },
                description: "New width as a percentage of page width (0–100)",
              },
              {
                displayName: "Height (%)",
                name: "height",
                type: "number",
                default: 5,
                typeOptions: { minValue: 0, maxValue: 100 },
                description: "New height as a percentage of page height (0–100)",
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
  const fieldsData = this.getNodeParameter("fields", itemIndex, {}) as {
    field?: Array<{
      id: number;
      updates?: {
        page?: number;
        positionX?: number;
        positionY?: number;
        width?: number;
        height?: number;
      };
    }>;
  };

  const fields = (fieldsData.field || []).map((f) => {
    const update: Record<string, any> = { id: f.id };
    const updates = f.updates ?? {};

    if (updates.page !== undefined) {
      update.page = updates.page;
    }
    if (updates.positionX !== undefined) {
      update.positionX = updates.positionX;
    }
    if (updates.positionY !== undefined) {
      update.positionY = updates.positionY;
    }
    if (updates.width !== undefined) {
      update.width = updates.width;
    }
    if (updates.height !== undefined) {
      update.height = updates.height;
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
