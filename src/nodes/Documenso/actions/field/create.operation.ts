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
    description: "The ID of the document or template to add fields to",
    displayOptions: {
      show: { resource: ["field"], operation: ["create"] },
    },
  },
  {
    displayName: "Positioning Mode",
    name: "positioningMode",
    type: "options",
    default: "placeholder",
    displayOptions: {
      show: { resource: ["field"], operation: ["create"] },
    },
    options: [
      {
        name: "Placeholder Text",
        value: "placeholder",
        description:
          "Match text in the PDF (e.g. {{signature}}) and place the field there",
      },
      {
        name: "Coordinates",
        value: "coordinates",
        description: "Specify exact page coordinates for field placement",
      },
      {
        name: "JSON",
        value: "json",
        description: "Provide a raw JSON array of field definitions",
      },
    ],
    description: "How to position fields on the document",
  },
  // -- Placeholder mode fields --
  {
    displayName: "Fields",
    name: "placeholderFields",
    type: "fixedCollection",
    typeOptions: { multipleValues: true },
    default: {},
    placeholder: "Add Field",
    displayOptions: {
      show: {
        resource: ["field"],
        operation: ["create"],
        positioningMode: ["placeholder"],
      },
    },
    options: [
      {
        displayName: "Field",
        name: "field",
        values: [
          {
            displayName: "Recipient ID",
            name: "recipientId",
            type: "number",
            required: true,
            default: 0,
            description: "The ID of the recipient this field is assigned to",
          },
          {
            displayName: "Placeholder Text",
            name: "placeholder",
            type: "string",
            required: true,
            default: "",
            placeholder: "{{signature}}",
            description:
              "Text to find in the PDF. The field will be placed at the location of this text.",
          },
          {
            displayName: "Match All Occurrences",
            name: "matchAll",
            type: "boolean",
            default: false,
            description:
              "Whether to place a field at every occurrence of the placeholder text",
          },
          {
            displayName: "Width",
            name: "width",
            type: "number",
            default: 0,
            description:
              "Override the field width (0 to auto-detect from the text bounding box)",
          },
          {
            displayName: "Height",
            name: "height",
            type: "number",
            default: 0,
            description:
              "Override the field height (0 to auto-detect from the text bounding box)",
          },
        ],
      },
    ],
  },
  // -- Coordinate mode fields --
  {
    displayName: "Fields",
    name: "coordinateFields",
    type: "fixedCollection",
    typeOptions: { multipleValues: true },
    default: {},
    placeholder: "Add Field",
    displayOptions: {
      show: {
        resource: ["field"],
        operation: ["create"],
        positioningMode: ["coordinates"],
      },
    },
    options: [
      {
        displayName: "Field",
        name: "field",
        values: [
          {
            displayName: "Recipient ID",
            name: "recipientId",
            type: "number",
            required: true,
            default: 0,
            description: "The ID of the recipient this field is assigned to",
          },
          {
            displayName: "Page",
            name: "page",
            type: "number",
            required: true,
            default: 1,
            description: "The page number (starting from 1)",
          },
          {
            displayName: "X (%)",
            name: "positionX",
            type: "number",
            required: true,
            default: 0,
            description:
              "Horizontal position as a percentage of the page width (0–100)",
          },
          {
            displayName: "Y (%)",
            name: "positionY",
            type: "number",
            required: true,
            default: 0,
            description:
              "Vertical position as a percentage of the page height (0–100)",
          },
          {
            displayName: "Width (%)",
            name: "width",
            type: "number",
            required: true,
            default: 15,
            description: "Width as a percentage of the page width (0–100)",
          },
          {
            displayName: "Height (%)",
            name: "height",
            type: "number",
            required: true,
            default: 5,
            description: "Height as a percentage of the page height (0–100)",
          },
        ],
      },
    ],
  },
  // -- JSON mode --
  {
    displayName: "Fields JSON",
    name: "fieldsJson",
    type: "json",
    required: true,
    default: "[]",
    description:
      "JSON array of field objects. Supports both coordinate-based and placeholder-based positioning.",
    displayOptions: {
      show: {
        resource: ["field"],
        operation: ["create"],
        positioningMode: ["json"],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const documentId = this.getNodeParameter("documentId", itemIndex) as string;
  const mode = this.getNodeParameter("positioningMode", itemIndex) as string;

  let fields: any[];

  if (mode === "placeholder") {
    const data = this.getNodeParameter("placeholderFields", itemIndex, {}) as {
      field?: Array<{
        recipientId: number;
        placeholder: string;
        matchAll?: boolean;
        width?: number;
        height?: number;
      }>;
    };

    fields = (data.field || []).map((f) => ({
      recipientId: f.recipientId,
      placeholder: f.placeholder,
      ...(f.matchAll ? { matchAll: f.matchAll } : {}),
      ...(f.width ? { width: f.width } : {}),
      ...(f.height ? { height: f.height } : {}),
    }));
  } else if (mode === "coordinates") {
    const data = this.getNodeParameter("coordinateFields", itemIndex, {}) as {
      field?: Array<{
        recipientId: number;
        page: number;
        positionX: number;
        positionY: number;
        width: number;
        height: number;
      }>;
    };

    fields = (data.field || []).map((f) => ({
      recipientId: f.recipientId,
      page: f.page,
      positionX: f.positionX,
      positionY: f.positionY,
      width: f.width,
      height: f.height,
    }));
  } else {
    fields = this.getNodeParameter("fieldsJson", itemIndex) as any[];
  }

  try {
    const client = await getDocumensoClient(this);

    const response = await client.envelopes.fields.createMany({
      envelopeId: documentId,
      data: fields as any,
    });

    return response;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
