import type {
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from "n8n-workflow";
import { NodeConnectionTypes } from "n8n-workflow";

export class DocumensoTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Documenso Trigger",
    name: "documensoTrigger",
    icon: "file:../Documenso/documenso.svg",
    group: ["trigger"],
    version: 1,
    subtitle: '={{$parameter["events"].join(", ")}}',
    description:
      "Starts the workflow when a Documenso event occurs (e.g. document signed, completed)",
    defaults: { name: "Documenso Trigger" },
    usableAsTool: true,
    inputs: [],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: "documensoApi",
        required: false,
      },
    ],
    webhooks: [
      {
        name: "default",
        httpMethod: "POST",
        responseMode: "onReceived",
        path: "webhook",
      },
    ],
    properties: [
      {
        displayName: "Events",
        name: "events",
        type: "multiOptions",
        required: true,
        default: [],
        description:
          "The events to listen for. Configure the same events in your Documenso webhook settings.",
        options: [
          {
            name: "Document Cancelled",
            value: "DOCUMENT_CANCELLED",
            description: "Triggered when a document is cancelled by the sender",
          },
          {
            name: "Document Completed",
            value: "DOCUMENT_COMPLETED",
            description:
              "Triggered when all recipients have signed the document",
          },
          {
            name: "Document Created",
            value: "DOCUMENT_CREATED",
            description: "Triggered when a new document is created",
          },
          {
            name: "Document Opened",
            value: "DOCUMENT_OPENED",
            description: "Triggered when a recipient opens the document",
          },
          {
            name: "Document Rejected",
            value: "DOCUMENT_REJECTED",
            description: "Triggered when a recipient rejects the document",
          },
          {
            name: "Document Sent",
            value: "DOCUMENT_SENT",
            description: "Triggered when a document is sent to recipients",
          },
          {
            name: "Document Signed",
            value: "DOCUMENT_SIGNED",
            description: "Triggered when a recipient signs the document",
          },
        ],
      },
      {
        displayName: "Webhook Secret",
        name: "webhookSecret",
        type: "string",
        typeOptions: { password: true },
        default: "",
        description:
          "Optional. If set, incoming requests must include this value in the X-Documenso-Secret header. Must match the secret configured in your Documenso webhook settings.",
      },
      {
        displayName:
          "You must manually configure the webhook in your Documenso dashboard. Go to Team Settings → Webhooks, create a new webhook, and paste the webhook URL shown above as the endpoint.",
        name: "notice",
        type: "notice",
        default: "",
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    
    const body = this.getBodyData() as {
      event?: string;
      payload?: Record<string, any>;
      createdAt?: string;
      webhookEndpoint?: string;
    };

    // Verify secret if configured
    const webhookSecret = this.getNodeParameter("webhookSecret", "") as string;

    if (webhookSecret) {
      const incomingSecret = req.headers["x-documenso-secret"] as string;

      if (incomingSecret !== webhookSecret) {
        return {
          noWebhookResponse: true,
        };
      }
    }

    // Filter by selected events
    const events = this.getNodeParameter("events", []) as string[];

    if (events.length > 0 && body.event && !events.includes(body.event)) {
      return {
        noWebhookResponse: true,
      };
    }

    return {
      workflowData: [this.helpers.returnJsonArray(body)],
    };
  }
}
