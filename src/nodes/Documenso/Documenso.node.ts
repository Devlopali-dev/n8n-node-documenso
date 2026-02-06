import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { NodeConnectionTypes } from "n8n-workflow";
import * as attachment from "./actions/attachment";

import * as document from "./actions/document";
import * as field from "./actions/field";
import * as file from "./actions/file";
import * as folder from "./actions/folder";
import * as recipient from "./actions/recipient";
import { router } from "./actions/router";
import * as template from "./actions/template";

export class Documenso implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Documenso",
    name: "documenso",
    icon: "file:documenso.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description:
      "Interact with Documenso - the open source document signing platform",
    defaults: { name: "Documenso" },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: "documensoApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        options: [
          { name: "Document", value: "document" },
          { name: "Template", value: "template" },
          { name: "Recipient", value: "recipient" },
          { name: "Field", value: "field" },
          { name: "File", value: "file" },
          { name: "Attachment", value: "attachment" },
          { name: "Folder", value: "folder" },
        ],
        default: "document",
      },
      ...document.descriptions,
      ...template.descriptions,
      ...recipient.descriptions,
      ...field.descriptions,
      ...file.descriptions,
      ...attachment.descriptions,
      ...folder.descriptions,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return router.call(this);
  }
}
