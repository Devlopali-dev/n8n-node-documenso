# n8n-nodes-documenso

[n8n](https://n8n.io/) community node for [Documenso](https://documenso.com) — the open source document signing platform.

Automate document signing workflows directly from n8n using the Documenso API v2.

## Prerequisites

You need a Documenso API key.

1. Log in at [app.documenso.com](https://app.documenso.com) (or your self-hosted instance)
2. Go to **Settings** → **API Tokens**
3. Click **Create Token** and copy the key

## Installation

In your n8n instance, go to **Settings** → **Community Nodes** and install:

```
@documenso/n8n-nodes-documenso
```

## Credentials

| Field | Description |
|-------|-------------|
| **API Key** | Your Documenso API token |
| **Base URL** | `https://app.documenso.com/api/v2` (default). Change for self-hosted instances. |

## Nodes

### Documenso

The main node with 7 resources and 35 operations.

#### Document

| Operation | Description |
|-----------|-------------|
| Find | Search for documents |
| Get | Get a document by ID |
| Create | Upload a PDF and create a new document |
| Create and Send | Upload a PDF, add recipients and fields, and send for signing — all in one step |
| Update | Update document metadata |
| Delete | Delete a document |
| Duplicate | Duplicate a document |
| Download | Download the signed PDF |
| Send | Send a document to recipients for signing |
| Resend | Resend to specific recipients |

#### Template

| Operation | Description |
|-----------|-------------|
| Find | Search for templates |
| Get | Get a template by ID |
| Create | Upload a PDF and create a new template |
| Update | Update template metadata |
| Delete | Delete a template |
| Duplicate | Duplicate a template |
| Use | Create a document from a template, optionally sending it immediately |

#### Recipient

| Operation | Description |
|-----------|-------------|
| Create | Add recipients to a document or template |
| Get | Get a recipient by ID |
| Update | Update recipients |
| Delete | Remove a recipient |

#### Field

| Operation | Description |
|-----------|-------------|
| Create | Add fields using placeholder text matching (`{{signature}}`), coordinates, or JSON |
| Get | Get a field by ID |
| Update | Update fields |
| Delete | Remove a field |

#### File

| Operation | Description |
|-----------|-------------|
| Upload | Upload files to a document or template |
| Download | Download a file |
| Update | Update file metadata |
| Delete | Remove a file |

#### Attachment

| Operation | Description |
|-----------|-------------|
| Find | List attachments on a document or template |
| Create | Add a URL attachment |
| Update | Update an attachment |
| Delete | Remove an attachment |

#### Folder

| Operation | Description |
|-----------|-------------|
| Find | Search for folders |
| Create | Create a folder |
| Update | Update a folder |
| Delete | Delete a folder |

### Documenso Trigger

Webhook-based trigger node that starts a workflow when a Documenso event occurs.

| Event | Description |
|-------|-------------|
| Document Created | A new document was created |
| Document Sent | A document was sent to recipients |
| Document Opened | A recipient opened the document |
| Document Signed | A recipient signed the document |
| Document Completed | All recipients have signed |
| Document Rejected | A recipient rejected the document |
| Document Cancelled | The sender cancelled the document |

Webhooks must be configured manually in Documenso (Team Settings → Webhooks). Optional secret verification via the `X-Documenso-Secret` header.

## Example Workflows

**Send a document for signing (one node):**

1. **Documenso** (Document: Create and Send) — upload PDF, add recipients with signing fields, sends immediately

**Send a document step-by-step:**

1. **Documenso** (Document: Create) — upload a PDF
2. **Documenso** (Recipient: Create) — add signers
3. **Documenso** (Field: Create) — add signature fields via placeholder text matching
4. **Documenso** (Document: Send) — send for signing

**Use a template:**

1. **Documenso** (Template: Use) — create document from template with recipient overrides, optionally send immediately

**React to signing events:**

1. **Documenso Trigger** (Document Completed) — triggers when all recipients have signed
2. **Documenso** (Document: Download) — download the signed PDF

## Self-Hosted

Change the **Base URL** in credentials to your instance:

```
https://your-domain.com/api/v2
```

## Development

```bash
bun install          # install dependencies
bun run build        # build with tsdown
bun run typecheck    # type-check
bun run check        # lint + format (biome)
bun run dev          # run n8n locally with docker compose
```

After changes: `bun run build && docker compose restart`

## Resources

- [Documenso API Documentation](https://docs.documenso.com/developers/public-api)
- [Documenso](https://documenso.com)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT
