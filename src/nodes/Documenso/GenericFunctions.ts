import { Documenso } from "@documenso/sdk-typescript";
import type { IExecuteFunctions } from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";

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

  return new Documenso({
    apiKey: credentials.apiKey as string,
    serverURL:
      (credentials.baseUrl as string) || "https://app.documenso.com/api/v2",
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
