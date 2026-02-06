---
description: n8n community node for Documenso document signing
globs: "*.ts, *.json"
alwaysApply: true
---

# @documenso/n8n-nodes-documenso

n8n community node package for the Documenso open source document signing platform. Uses the `@documenso/sdk-typescript` SDK internally, exposing it through n8n's node UI.

## Commands

- `bun install` — install dependencies
- `bun run build` — build with tsdown (CJS output to dist/)
- `bun run typecheck` — type-check with tsc --noEmit
- `bun run check` — biome check --write (lint + format)
- `bun run lint` — biome lint only
- `bun run format` — biome format --write only
- `bun run dev` — docker compose up (runs n8n with the node loaded at http://localhost:5678)

After changes: `bun run build && docker compose restart` to see them in n8n.

## Code Style

- **Formatter**: Biome — 2-space indent, double quotes
- **Block statements**: Always use braces (`if (x) { ... }`, never `if (x) ...`)
- **`any` types**: Allowed (biome `noExplicitAny: off`) — unavoidable with n8n's `getNodeParameter` and SDK response types
- **Imports**: Auto-organized by biome assist

## Architecture

### Source layout (`src/`)

```
src/
  index.ts                              # Package exports
  credentials/
    DocumensoApi.credentials.ts         # API Key + Base URL credential
  nodes/
    Documenso/
      Documenso.node.ts                 # Main node — resource/operation selector
      Documenso.node.json               # Codex metadata
      documenso.svg                     # Node icon
      GenericFunctions.ts               # SDK client factory + error handling
      actions/
        router.ts                       # Dispatches resource+operation → per-item execute
        document/                       # 10 ops: find, get, create, createAndSend, update, delete, duplicate, download, send, resend
        template/                       # 7 ops: find, get, create, update, delete, duplicate, use
        recipient/                      # 4 ops: create, get, update, delete
        field/                          # 4 ops: create, get, update, delete
        file/                           # 4 ops: upload, download, update, delete
        attachment/                     # 4 ops: find, create, update, delete
        folder/                         # 4 ops: find, create, update, delete
    DocumensoTrigger/
      DocumensoTrigger.node.ts          # Webhook trigger node
```

### Key design decisions

- **Envelopes API only**: Document and Template resources both use `client.envelopes.*` under the hood. Document passes `type: "DOCUMENT"`, Template passes `type: "TEMPLATE"`. We do NOT use the older `client.documents.*` or `client.templates.*` SDK methods.
- **Parameter naming**: Use `documentId`/`templateId` in user-facing params, map to `envelopeId` when calling the SDK.
- **SDK is bundled**: tsdown inlines `@documenso/sdk-typescript` into the output via `noExternal`. Only `n8n-workflow` is external (provided by n8n at runtime). This means the published package has zero runtime dependencies.
- **CJS output**: n8n requires CommonJS. tsdown outputs `.js` (not `.cjs`) via `outExtensions`.

### Adding a new operation

1. Create `src/nodes/Documenso/actions/<resource>/<operation>.operation.ts`
2. Export `description: INodeProperties[]` with `displayOptions: { show: { resource: [...], operation: [...] } }`
3. Export `async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any>`
4. Import and register in the resource's `index.ts` (add to `descriptions` array and `operations` map)
5. If adding a new resource, also register in `Documenso.node.ts`, `router.ts`, and the resource options list

### Operation file pattern

```ts
import type { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import { getDocumensoClient, handleDocumensoError } from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "Document ID",
    name: "documentId",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["document"], operation: ["myOp"] } },
  },
];

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<any> {
  const documentId = this.getNodeParameter("documentId", itemIndex) as string;
  try {
    const client = await getDocumensoClient(this);
    return await client.envelopes.someMethod({ envelopeId: documentId });
  } catch (error) {
    handleDocumensoError(this, error, itemIndex);
  }
}
```

### UX conventions

- Use **fixedCollection** with `multipleValues: true` instead of JSON inputs for structured data (recipients, fields, etc.)
- Use user-friendly operation names: "Send" not "Distribute", "Resend" not "Redistribute"
- Coordinates are **percentages** (0–100) of page width/height, not pixels
- Field positioning supports both **placeholder text matching** (`{{signature}}`) and coordinate modes
- The "Create and Send" operation is the happy path — upload PDF + recipients + fields + send in one step

### Build

tsdown bundles entry points to `dist/`. The `copy` config in `tsdown.config.ts` handles static assets (SVG icon, codex JSON). When adding a new node, add its entry to `tsdown.config.ts` and `package.json`'s `n8n.nodes` array.

### Testing locally

`docker compose up` mounts `dist/` and `package.json` into n8n's custom nodes directory. The node appears in n8n's palette at http://localhost:5678.
