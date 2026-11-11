# Environments

Two long-lived branches, two deployed environments. Same model as the CAD app (`mobilcab-cad`).

| Branch | Worker | URL | Access | Backend for the Founding Partner form |
|---|---|---|---|---|
| `develop` | `mobilcab-website-develop` | https://web-develop.mobilcab.com | Cloudflare Access: only Fineas and Stefan | Brevo only until `NEON_DATA_API_URL` is set on the GitHub `develop` environment (then Neon `dev`, the same as `develop.mobilcab.com`) |
| `main` | `mobilcab-website` | https://mobilcab.com | public | Brevo + Neon `main` (the production CAD admin panel) |

## Workflow

- Work on a branch made from `develop`, merge it back into `develop`.
- A release is `develop` -> `main` (merge commit, tag when it matters). Nobody commits straight to `main`.
- Every push to `develop` or `main` runs `.github/workflows/cloudflare-worker-deploy.yml`, which tests, deploys
  that branch's Worker and syncs its secrets. The cleanup cron Worker is deployed from `main` only.
- Keep `develop` in step with the CAD app: when the app's `develop` changes the waitlist RPC
  (`public.submit_waitlist_request`), change `src/lib/neon.ts` in the same round.

## Founding Partner request flow

`POST /api/founding-partner` (name, email, phone, city required; workshop optional):

1. Brevo list (cap, "already on the list" check).
2. Neon Data API -> `rpc/submit_waitlist_request`, which fills the admin panel of the CAD app.
   Skipped when `NEON_DATA_API_URL` is unset; a failure never fails the sign-up.
3. Two emails through Brevo: a confirmation to the person and a notification to `contact@mobilcab.com`
   (it says so when step 2 failed).

## One-time setup (manual)

1. **GitHub environments** `production` and `develop` (Settings -> Environments). The repository-level secrets keep
   working for both; add environment secrets only where `develop` must differ:
   - `NEON_DATA_API_URL`: `production` = Data API of Neon `main`; `develop` = Data API of Neon `dev`
     (`.../neondb/rest/v1`, see `environment.m1-dev.ts` in mobilcab-cad), or leave empty for Brevo-only.
   - `BREVO_FP_LIST_ID`, `BREVO_LIST_ID`, `BREVO_LIST_ID_EN`, and `BREVO_API_KEY` if you want a separate
     Brevo account: test sign-ups from `web-develop` must not land in the real lists.
2. **Cloudflare Access** for `web-develop.mobilcab.com`: add the domain to `.claude/scripts/cloudflare-access-setup.mjs`
   in mobilcab-cad and run it (same two allowed emails as `develop.mobilcab.com`).
   `workers_dev` and `preview_urls` are off in `wrangler.jsonc` so no other address bypasses Access.
3. First push to `develop` creates the Worker and the `web-develop.mobilcab.com` custom domain.
4. Branch protection (Settings -> Branches): `main` and `develop` require a PR.
