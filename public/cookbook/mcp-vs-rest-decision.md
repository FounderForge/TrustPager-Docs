# MCP vs REST — when to use which

TrustPager exposes the same workspace through two surfaces:

- **MCP server** — 670+ typed tools your AI assistant invokes mid-conversation. Workspace-scoped URL of shape `https://mcp.trustpager.com/<workspace-slug>/mcp` (HTTP streamable transport). The full `claude mcp add ...` command for your workspace is on https://app.trustpager.com/auto/ai-access.
- **REST API** — `https://api.trustpager.com/functions/v1/api/v1/<resource>`, `Authorization: Bearer tp_live_...`. Full reference at https://docs.trustpager.com/openapi.json.

They are **not redundant.** Each is correct for a different shape of work.

---

## Use MCP when

- ✅ **A user is in the conversation.** MCP tools return shaped JSON the model reads directly. No context overhead from URL parsing or response shape inference.
- ✅ **You need 1-20 records.** Cost per tool call is small relative to the rest of the conversation.
- ✅ **You need approval gating.** MCP keys with `-approval` scopes queue writes for human review. Critical for production-touching writes.
- ✅ **You need conversation-aware features.** `describe_resource`, `get_ai_instructions`, `search_help_center` are MCP-only.
- ✅ **You're doing one-off CRUD.** Create a contact, attach a file, send an email — straight MCP call.

---

## Use REST when

- ✅ **Bulk fetching ≥20 records.** Transcripts, contacts, opportunities, activities, anything paginated. Saves context, paginates cheaply. See [bulk-fetch-transcripts](bulk-fetch-transcripts.md).
- ✅ **Scripted or scheduled work outside a session.** Cron jobs, weekly exports, data pipelines — no AI in the loop.
- ✅ **Chained multi-step operations.** `POST /batch` accepts up to 250 ops in one request with `$opId.field` references between them.
- ✅ **You're building tooling clients install.** SDKs, integrations, dashboards — REST is the stable contract.
- ✅ **The model is reasoning over thousands of records.** MCP cost compounds linearly. REST is page-based.

---

## What's the same either way

| | MCP | REST |
|---|---|---|
| Auth | Same key (`tp_live_*`) | Same key |
| Scopes | Stamped on key at creation | Same |
| Workspace isolation | Enforced | Same |
| Approval queue | 202 on approval-scoped writes | 202 on approval-scoped writes |
| Idempotency | `Idempotency-Key` header | Same |
| Pagination | Returns `pagination: {has_more, next_cursor}` | Same |
| Read credit cost | 0 | 0 |

---

## What's different

| | MCP | REST |
|---|---|---|
| Send credit cost (per email/sms/etc) | 1× rate | 10× rate (flat) |
| AI tool credit cost | 1× rate | 10× rate (flat) |
| Tool discovery | `/_meta/tools` returns scoped catalog | `https://docs.trustpager.com/openapi.json` |
| Response shape | Direct JSON object | `{ data, pagination?, meta }` wrapper |
| Streaming | No | No (HTTP/1) |
| Approval visibility | Same approvals panel | Same approvals panel |

The 10x flat-rate on REST credit-bearing tools exists because REST callers tend to fan out — sending 10,000 emails through a script is a different cost profile than a model deciding to send one email mid-conversation.

---

## Common mistakes

- ❌ **Looping `get_transcript` in MCP for >20 records.** Context burns. Use REST `list_transcripts` + per-id fetch.
- ❌ **Calling REST for one-off interactive CRUD.** Pay extra context to construct a URL when MCP has a typed tool ready.
- ❌ **Assuming REST is "more powerful."** Both surfaces have exact feature parity. The difference is shape, not capability.
- ❌ **Using two API keys (one for MCP, one for REST).** Use the same key — scopes and approvals follow you across surfaces.

---

## Related recipes

- [bulk-fetch-transcripts](bulk-fetch-transcripts.md)
- [paginate-correctly](paginate-correctly.md)
