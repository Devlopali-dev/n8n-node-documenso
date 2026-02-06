# n8n-nodes-documenso

This is an [n8n](https://n8n.io/) community node for [Documenso](https://documenso.com) — the open source document signing platform.

It lets you automate document signing workflows directly from n8n using the Documenso API v2.

## Prerequisites

You need a Documenso API key to use this node.

1. Log in to your Documenso account at [app.documenso.com](https://app.documenso.com) (or your self-hosted instance)
2. Go to **Settings** -> **API Tokens**
3. Click **Create Token** and copy the generated API key (starts with `api_`)

## Installation

In your n8n instance, go to **Settings** -> **Community Nodes** and install:

```
@documenso/n8n-nodes-documenso
```

Or install via npm:

```bash
npm install @documenso/n8n-nodes-documenso
```

## Credentials

When setting up the Documenso credential in n8n:

| Field | Description |
|-------|-------------|
| **API Key** | Your Documenso API token |
| **Base URL** | `https://app.documenso.com/api/v2` (default). Change this for self-hosted instances. |

## Supported Operations

### Document

Create, manage, and send documents for signing.

| Operation | Description |
|-----------|-------------|
| Create | Upload a PDF and create a new document |
| Delete | Delete a document |
| Distribute | Send a document to recipients for signing |
| Duplicate | Duplicate a document |
| Find | Search for documents |
| Get | Get a document by ID |
| Redistribute | Resend a document to specific recipients |
| Update | Update document metadata |

### Template

Create and manage reusable signing templates.

| Operation | Description |
|-----------|-------------|
| Create | Upload a PDF and create a new template |
| Delete | Delete a template |
| Duplicate | Duplicate a template |
| Find | Search for templates |
| Get | Get a template by ID |
| Update | Update template metadata |
| Use | Create a document from a template |

### Recipient

Manage signers and other recipients on documents/templates.

| Operation | Description |
|-----------|-------------|
| Create Many | Add multiple recipients |
| Delete | Remove a recipient |
| Get | Get a recipient by ID |
| Update Many | Update multiple recipients |

### Field

Manage signature fields, text fields, and other form fields.

| Operation | Description |
|-----------|-------------|
| Create Many | Add multiple fields |
| Delete | Remove a field |
| Get | Get a field by ID |
| Update Many | Update multiple fields |

### Item

Manage document files (PDFs) within envelopes.

| Operation | Description |
|-----------|-------------|
| Create Many | Upload files as envelope items |
| Delete | Remove an item |
| Download | Download an item file |
| Update Many | Update item metadata |

### Attachment

Manage link attachments on documents/templates.

| Operation | Description |
|-----------|-------------|
| Create | Add an attachment |
| Delete | Remove an attachment |
| Find | List all attachments |
| Update | Update an attachment |

### Folder

Organize documents and templates into folders.

| Operation | Description |
|-----------|-------------|
| Create | Create a folder |
| Delete | Delete a folder |
| Find | Search for folders |
| Update | Update a folder |

### Embedding

Manage presign tokens for embedded signing.

| Operation | Description |
|-----------|-------------|
| Create Presign Token | Generate an embedding presign token |
| Verify Presign Token | Verify an embedding presign token |

## Example Workflow

A typical document signing workflow in n8n:

1. **Documenso** (Document: Create) - Upload a PDF
2. **Documenso** (Recipient: Create Many) - Add signers
3. **Documenso** (Field: Create Many) - Add signature fields
4. **Documenso** (Document: Distribute) - Send for signing

For templates:

1. **Documenso** (Template: Use) - Create document from template with recipient overrides
2. The template's pre-configured fields and recipients are applied automatically

## Self-Hosted Documenso

If you're running a self-hosted Documenso instance, change the **Base URL** in the credentials to point to your instance:

```
https://your-documenso-domain.com/api/v2
```

## Resources

- [Documenso API Documentation](https://docs.documenso.com/developers/public-api)
- [Documenso Website](https://documenso.com)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT
