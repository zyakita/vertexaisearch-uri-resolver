# Gemini Grounding URL Fixer

When using the Gemini API with Google Search grounding, the API returns censored `uri` values that look like this:

```json
"groundingChunks": [
  {
    "web": {
      "uri": "https://vertexaisearch.cloud.google.com/...",
      "title": "example.com"
    }
  }
]
```

Trying to fetch this `uri` from a browser fails due to CORS issues, which is a dead end for finding the source.

## The Fix

This tiny app is a simple workaround. It does one thing: it accepts the proxy URI, sends a server-side `HEAD` request with `redirect: 'follow'`, and returns the final destination URL.

No content is downloaded; it's just a quick redirect chase.

## Usage

Send a `POST` request with the `uri` you want to resolve.

### Request

`POST /`

```json
{
  "uri": "https://vertexaisearch.cloud.google.com/....."
}
```

### Response

```json
{
  "url": "https://the.real.destination/url/path"
}
```

### `curl` Example

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"uri": "https://vertexaisearch.cloud.google.com/..."}' \
  http://localhost:3000
```