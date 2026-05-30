# Bulk-fetch transcripts

**Goal:** fetch hundreds of call/meeting transcripts from a TrustPager workspace and save them to disk for offline analysis (summarisation, pattern mining, training data, etc).

**Why not MCP:** every `get_transcript` MCP call burns conversation context. For 50+ transcripts, the context cost dominates. REST is one-shot per page (up to 100 records each), the model never sees the raw bodies until you choose to load them.

**Auth:** `Authorization: Bearer tp_live_...` (one API key per workspace). Create at https://app.trustpager.com/settings/api with the `transcripts:read` scope.

---

## Python — paste this into Claude Code

```python
import json, os, urllib.request
from pathlib import Path

API_KEY = os.environ.get("TP_LIVE_KEY") or "tp_live_REPLACE_ME"
BASE = "https://api.trustpager.com/functions/v1/api/v1"
OUT = Path("./transcripts")
OUT.mkdir(exist_ok=True)

def _get(path):
    req = urllib.request.Request(f"{BASE}{path}", headers={"Authorization": f"Bearer {API_KEY}"})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def list_all(contact_id=None, deal_id=None, limit=100):
    """Yield every transcript record (id + summary), paging with the cursor."""
    cursor = None
    while True:
        q = f"?limit={limit}"
        if contact_id: q += f"&contact_id={contact_id}"
        if deal_id:    q += f"&deal_id={deal_id}"
        if cursor:     q += f"&after={cursor}"
        body = _get(f"/transcripts{q}")
        for row in body["data"]:
            yield row
        page = body.get("pagination", {})
        if not page.get("has_more"):
            return
        cursor = page["next_cursor"]

def fetch_full(transcript_id):
    """Fetch a single transcript with its body."""
    return _get(f"/transcripts/{transcript_id}")["data"]

# Usage — fetch every transcript for a contact, save each as ./transcripts/<id>.json
target_contact = "REPLACE_WITH_CONTACT_UUID"
for record in list_all(contact_id=target_contact):
    full = fetch_full(record["id"])
    (OUT / f"{record['id']}.json").write_text(json.dumps(full, indent=2))
    print(f"saved {record['id']}: {full.get('title', '(untitled)')}")
```

---

## Tuning knobs

- **`?fields=`** — drop heavy fields you don't need. `?fields=id,title,created_at,duration_seconds,summary` keeps responses tiny when you're just indexing.
- **`?expand=`** — pull related objects in the same response. Available on transcripts: `expand=contact,deal`.
- **Date range** — `?created_after=2026-01-01T00:00:00Z&created_before=2026-06-01T00:00:00Z` to bound the set.
- **Rate limit** — 60 requests/minute by default per key. Bulk paging is well under this; if you fan out fetches in parallel, add a small sleep or back off on 429.

---

## When to switch to MCP

Once you've got the transcript bodies on disk, switch back to MCP for the **analysis** phase — `ai_transcript_summary`, `ai_call_coaching`, `ai_needs_analysis` are all richer than what raw REST gives you, and credits-cheaper than REST AI tools (see the pricing in `get_ai_instructions` `credits` section).

---

## Common mistakes

- ❌ Calling `get_transcript` in a tight MCP loop. Burns context, hits rate limits faster, never finishes for >50 transcripts.
- ❌ Forgetting `pagination.has_more`. The default limit is 25 — a "complete" first page is almost never the whole set.
- ❌ Using `?cursor=` instead of `?after=`. The parameter is `after`. (`cursor` is the field name in the response.)
- ❌ Holding all responses in memory. Stream to disk; the model reads disk faster than it re-invokes tools.

---

## Related recipes

- [paginate-correctly](paginate-correctly.md) — pagination patterns for any list endpoint
- [mcp-vs-rest-decision](mcp-vs-rest-decision.md) — when each is correct
