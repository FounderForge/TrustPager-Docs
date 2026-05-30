# Paginate correctly

Every TrustPager list endpoint uses **cursor-based pagination**. Get this right once; it works the same on every resource.

---

## The shape

```json
{
  "data": [ /* up to `limit` records */ ],
  "pagination": {
    "limit": 25,
    "has_more": true,
    "next_cursor": "a1b2c3d4-...",
    "prev_cursor": null
  },
  "meta": { "credits_remaining": 9500 }
}
```

- **`limit`** — defaults to 25, max 100. Pass `?limit=100` for the largest page.
- **`has_more`** — `true` if there are more records past this page. **Always check this.** A page returning exactly `limit` records is not necessarily the last page.
- **`next_cursor`** — opaque string. Pass it back as `?after=<cursor>` to get the next page.
- **`prev_cursor`** — pass as `?before=<cursor>` to walk backwards.

---

## The pattern

```python
import json, urllib.request, os
KEY = os.environ["TP_LIVE_KEY"]
BASE = "https://api.trustpager.com/functions/v1/api/v1"

def list_all(resource, extra_params=""):
    """Yield every record on every page."""
    cursor = None
    while True:
        q = f"?limit=100{extra_params}"
        if cursor: q += f"&after={cursor}"
        req = urllib.request.Request(f"{BASE}/{resource}{q}",
                                     headers={"Authorization": f"Bearer {KEY}"})
        body = json.loads(urllib.request.urlopen(req).read())
        yield from body["data"]
        page = body.get("pagination", {})
        if not page.get("has_more"):
            return
        cursor = page["next_cursor"]

# Examples
for c in list_all("contacts"):                          print(c["id"], c["email"])
for o in list_all("opportunities", "&pipeline_id=..."): print(o["id"], o["name"])
for t in list_all("transcripts", "&contact_id=..."):    print(t["id"])
```

---

## Optimisations

### Field selection — cut payload size

If you only need a few columns, ask for them:

```
GET /contacts?limit=100&fields=id,email,phone&after=...
```

10x to 100x smaller payloads on heavy resources (contacts with custom fields, opportunities with metadata). Crucial when bulk-fetching across thousands of records.

### Expansions — embed related objects in one round-trip

Instead of fetching contacts and then making N requests for each contact's employers, ask for the embed:

```
GET /contacts?limit=100&expand=employers
```

Available expansions per resource are listed in the OpenAPI spec under each list endpoint. Max 5 expansions per request. See `expansion` in `get_ai_instructions` for the shortlist.

### Date range filters — bound the set

Most list endpoints accept `created_after` and `created_before`:

```
GET /transcripts?created_after=2026-01-01T00:00:00Z&created_before=2026-06-01T00:00:00Z
```

If you only want recent records, this turns "page through 10,000 records" into "page through 200."

---

## Sorting

```
GET /contacts?sort=created_at&order=desc
```

Sort fields: usually `created_at`, `updated_at`, and a resource-specific primary (e.g. `name` on contacts, `amount` on opportunities). Order: `asc` or `desc`. Defaults vary per endpoint; check the OpenAPI spec.

---

## Common mistakes

- ❌ **Stopping when `data.length === limit`.** That's only ONE page. Check `pagination.has_more`.
- ❌ **Using `?cursor=` instead of `?after=`.** The query param is `after`. The response field is `next_cursor`. Easy to mix up.
- ❌ **Holding everything in memory.** For >1000 records, stream to disk (one JSON file per page is fine).
- ❌ **Re-requesting the first page.** Each cursor encodes its position; just pass `next_cursor` back. Don't refetch page 1.
- ❌ **Skipping `?fields=`** when the analysis only needs 3 columns. Payload bloat compounds across pages.
- ❌ **Parallel paging.** Cursors are sequential — page N depends on page N-1's cursor. If you need parallelism, partition by `created_after`/`created_before` ranges instead.

---

## Related recipes

- [bulk-fetch-transcripts](bulk-fetch-transcripts.md)
- [mcp-vs-rest-decision](mcp-vs-rest-decision.md)
