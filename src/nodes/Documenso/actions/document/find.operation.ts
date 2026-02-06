import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import {
  getDocumensoClient,
  handleDocumensoError,
} from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    description: "Whether to return all results or only up to a given limit",
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["find"],
      },
    },
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    default: 50,
    typeOptions: {
      minValue: 1,
    },
    description: "Max number of results to return",
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["find"],
        returnAll: [false],
      },
    },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["document"],
        operation: ["find"],
      },
    },
    options: [
      {
        displayName: "Query",
        name: "query",
        type: "string",
        default: "",
        description: "Search query to filter documents",
      },
      {
        displayName: "Status",
        name: "status",
        type: "options",
        options: [
          { name: "Draft", value: "DRAFT" },
          { name: "Pending", value: "PENDING" },
          { name: "Completed", value: "COMPLETED" },
          { name: "Rejected", value: "REJECTED" },
        ],
        default: "DRAFT",
        description: "Filter documents by status",
      },
      {
        displayName: "Folder ID",
        name: "folderId",
        type: "string",
        default: "",
        description: "Filter documents by folder ID",
      },
      {
        displayName: "Order By Direction",
        name: "orderByDirection",
        type: "options",
        options: [
          { name: "Ascending", value: "asc" },
          { name: "Descending", value: "desc" },
        ],
        default: "desc",
        description: "The direction to order results by",
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const returnAll = this.getNodeParameter("returnAll", itemIndex) as boolean;
  const additionalFields = this.getNodeParameter(
    "additionalFields",
    itemIndex,
    {},
  ) as Record<string, any>;

  try {
    const client = await getDocumensoClient(this);

    const params: Record<string, any> = {
      type: "DOCUMENT",
    };

    if (additionalFields.query) {
      params.query = additionalFields.query;
    }

    if (additionalFields.status) {
      params.status = additionalFields.status;
    }

    if (additionalFields.folderId) {
      params.folderId = additionalFields.folderId;
    }

    if (additionalFields.orderByDirection) {
      params.orderByDirection = additionalFields.orderByDirection;
    }

    if (returnAll) {
      const allResults: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await client.envelope.envelopeFind({
          ...params,
          page,
          perPage: 100,
        });
        allResults.push(...response.data);
        hasMore = response.currentPage < response.totalPages;
        page++;
      }

      return allResults;
    }

    const limit = this.getNodeParameter("limit", itemIndex) as number;
    const response = await client.envelope.envelopeFind({
      ...params,
      page: 1,
      perPage: limit,
    });

    return response.data;
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
