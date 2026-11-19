# Server action answers 500 once the page's prerendered entry is stale

Minimal reproduction for a bug in Next.js 16.3.8 under `next start` (not minimal mode). Same code in 16.4.6 and 16.5.0-canary.56.

A server action sent from a prerendered page whose cache entry is stale runs once and returns its result, but the response
status is 500, and the server logs:

```
⨯ SyntaxError: Unexpected end of JSON input
    at JSON.parse (<anonymous>) {
  digest: '...'
}
```

## Steps

```sh
npm install
npx playwright install chromium
npm run build
npm start          # in one terminal
npm run repro      # in another: loads /, waits 6 s, clicks Save once
```

`repro.mjs` prints `{ actionStatus: 500, result: 'saved hello' }`. The server log shows `action ran with "hello"` once,
then the error.

The page uses `cacheComponents: true` and a `'use cache'` read with a 5 second `revalidate`, so its prerendered entry is
stale six seconds after it was made. Clicking Save before that answers 200.

## Cause

In `dist/build/templates/app-page-runtime.js`, a server action on a stale entry schedules a background revalidation through
`responseGenerator({ ...c, forceStaticRender: true })`. That calls `doRender`, which passes the request's
`isPossibleServerAction` (still `true`) into the render options. The render calls `handleAction` a second time, on a request
body the first run already read, so `decodeReply("")` throws, and the error sets 500 on the response the client is waiting for.

## Fix

In `doRender`'s render options (both the CommonJS and the `esm` template):

```diff
-                        isPossibleServerAction,
+                        isPossibleServerAction: forceStaticRender ? false : isPossibleServerAction,
```

With it, the action answers 200, runs once, and the background revalidation still regenerates the page (the "Rendered at"
time changes after the action).
