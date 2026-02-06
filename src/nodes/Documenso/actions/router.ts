import type { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import * as attachment from "./attachment";
import * as document from "./document";
import * as field from "./field";
import * as file from "./file";
import * as folder from "./folder";
import * as recipient from "./recipient";
import * as template from "./template";

type OperationFunction = (
  this: IExecuteFunctions,
  itemIndex: number,
) => Promise<any>;

const resourceMap: Record<string, Record<string, OperationFunction>> = {
  document: document.operations,
  template: template.operations,
  recipient: recipient.operations,
  field: field.operations,
  file: file.operations,
  attachment: attachment.operations,
  folder: folder.operations,
};

export async function router(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const returnData: INodeExecutionData[] = [];
  const resource = this.getNodeParameter("resource", 0) as string;
  const operation = this.getNodeParameter("operation", 0) as string;

  const executeFunction = resourceMap[resource]?.[operation];

  if (!executeFunction) {
    throw new Error(`Unknown resource/operation: ${resource}/${operation}`);
  }

  for (let i = 0; i < items.length; i++) {
    try {
      const result = await executeFunction.call(this, i);
      
      const executionData = this.helpers.constructExecutionMetaData(
        this.helpers.returnJsonArray(result),
        { itemData: { item: i } },
      );
      
      returnData.push(...executionData);
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: (error as Error).message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return [returnData];
}
