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
    displayOptions: { show: { resource: ["folder"], operation: ["find"] } },
    description: "Whether to return all results or only up to a given limit",
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    default: 50,
    typeOptions: { minValue: 1, maxValue: 1000 },
    displayOptions: {
      show: { resource: ["folder"], operation: ["find"], returnAll: [false] },
    },
    description: "Max number of results to return",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["folder"], operation: ["find"] } },
    options: [
      {
        displayName: "Query",
        name: "query",
        type: "string",
        default: "",
        description: "Search query to filter folders",
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<any> {
  const client = await getDocumensoClient(this);

  const returnAll = this.getNodeParameter("returnAll", itemIndex) as boolean;
  const additionalFields = this.getNodeParameter(
    "additionalFields",
    itemIndex,
    {},
  ) as Record<string, any>;

  try {
    if (returnAll) {
      const allResults: any[] = [];
      
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        const response = await client.folders.find({
          page,
          perPage: 100,
          ...(additionalFields.query ? { query: additionalFields.query } : {}),
        });
        
        allResults.push(...response.data);
        
        hasMore = response.currentPage < response.totalPages;
        
        page++;
      }

      return allResults;
    } else {
      const limit = this.getNodeParameter("limit", itemIndex, 50) as number;
      
      const response = await client.folders.find({
        page: 1,
        perPage: Math.min(limit, 100),
        ...(additionalFields.query ? { query: additionalFields.query } : {}),
      });

      return response.data.slice(0, limit);
    }
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
