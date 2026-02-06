import type { ICredentialType, INodeProperties } from "n8n-workflow";

export class DocumensoApi implements ICredentialType {
  name = "documensoApi";
  displayName = "Documenso API";
  documentationUrl =
    "https://docs.documenso.com/developers/public-api/authentication";

  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: { password: true },
      default: "",
      required: true,
      description: "Your Documenso API key. Find it in Settings → API Tokens.",
    },
    {
      displayName: "Base URL",
      name: "baseUrl",
      type: "string",
      default: "https://app.documenso.com/api/v2",
      required: true,
      description:
        "The base URL of your Documenso instance API. For self-hosted instances, change this to your domain (e.g. https://your-domain.com/api/v2).",
    },
  ];
}
