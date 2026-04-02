import { Documenso } from "@documenso/sdk-typescript";
import type { IExecuteFunctions } from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

const API_KEY_PATTERN = /^[a-zA-Z0-9_\-.]+$/;
const ALLOWED_URL_SCHEMES = ["https:", "http:"];

export async function getDocumensoClient(
  context: IExecuteFunctions,
): Promise<Documenso> {
  const credentials = await context.getCredentials("documensoApi");

  if (!credentials.apiKey) {
    throw new NodeOperationError(
      context.getNode(),
      "No API key provided in Documenso credentials",
    );
  }

  const apiKey = credentials.apiKey as string;
  if (!API_KEY_PATTERN.test(apiKey)) {
    throw new NodeOperationError(
      context.getNode(),
      "Invalid API key format in Documenso credentials",
    );
  }

  const defaultUrl = "https://app.documenso.com/api/v2";
  const rawBaseUrl = (credentials.baseUrl as string) || defaultUrl;

  let serverURL: string;
  try {
    const parsed = new URL(rawBaseUrl);
    if (!ALLOWED_URL_SCHEMES.includes(parsed.protocol)) {
      throw new Error("Invalid scheme");
    }
    serverURL = parsed.toString();
  } catch {
    throw new NodeOperationError(
      context.getNode(),
      "Invalid base URL in Documenso credentials. Must be a valid http or https URL.",
    );
  }

  return new Documenso({
    apiKey,
    serverURL,
  });
}

export function handleDocumensoError(
  context: IExecuteFunctions,
  error: unknown,
  itemIndex: number,
): never {
  if (error instanceof Error) {
    const anyError = error as any;
    const message =
      anyError.data$?.message ?? anyError.message ?? "Unknown error";
    const details: string[] = [];

    if (anyError.statusCode) {
      details.push(`Status: ${anyError.statusCode}`);
    }

    if (anyError.data$?.issues) {
      const issues = anyError.data$.issues
        .map((i: { message?: string }) => i.message)
        .filter(Boolean)
        .join(", ");

      if (issues) {
        details.push(issues);
      }
    }

    throw new NodeOperationError(context.getNode(), message, {
      itemIndex,
      description: details.length > 0 ? details.join(" | ") : undefined,
    });
  }

  throw new NodeOperationError(context.getNode(), "An unknown error occurred", {
    itemIndex,
  });
}
