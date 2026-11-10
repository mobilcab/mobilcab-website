# Email deliverability (Brevo + mobilcab.com)

Goal: confirmation + welcome emails land in **Inbox**, not Spam/Promotions.

## DNS (live check 2026-11-10)

| Record | Status | Value |
|---|---|---|
| SPF | OK | `v=spf1 include:spf.improvmx.com include:spf.brevo.com ~all` |
| DKIM | OK | `brevo1._domainkey` → `b1.mobilcab-com.dkim.brevo.com` · `brevo2._domainkey` → `b2.mobilcab-com.dkim.brevo.com` |
| DMARC | OK (`p=none`) | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |
| Brevo verify TXT | OK | `brevo-code:…` on apex |
| MX | ImprovMX | inbound mail via ImprovMX (fine alongside Brevo send) |

Re-check anytime:

```bash
dig +short TXT mobilcab.com | grep -Ei 'spf|brevo'
dig +short TXT _dmarc.mobilcab.com
dig +short CNAME brevo1._domainkey.mobilcab.com
dig +short CNAME brevo2._domainkey.mobilcab.com
```

## Brevo UI (must be green)

1. **Senders, Domains & Dedicated IPs → Domains**  
   `mobilcab.com` must show **Authenticated** (DKIM + DMARC). If not, click Authenticate / Verify — DNS above already matches.
2. **Senders**  
   From address must be on `mobilcab.com` (e.g. `hello@mobilcab.com` / `noutati@mobilcab.com`), not a free mailbox. Same domain as authenticated.
3. **Transactional templates**  
   Re-paste `emails/confirm-ro.html` + `confirm-en.html` and set subjects exactly:
   - RO: `Confirmă-ți abonarea la noutăți Mobilcab`
   - EN: `Confirm your Mobilcab news signup`
4. **Marketing templates / automations**  
   Re-paste newsletter + founding-partner HTML; subjects **without emoji** (emoji + “spam” wording hurt filters):
   - `Ești abonat la noutăți Mobilcab`
   - `You're subscribed to Mobilcab news`
   - `Ești pe lista Partener Fondator`
   - `You're on the Founding Partner list`
5. **One-click unsubscribe**  
   Marketing templates keep `{{ unsubscribe }}` in the footer (already in generated HTML). Leave Brevo’s List-Unsubscribe headers on.

## Warm-up / inbox placement

- New / low-volume domains often land in Spam for the first days. Mark **Not spam** on test accounts (Gmail + Outlook).
- Prefer sending to people who **opted in** (double opt-in is already on).
- Keep complaint rate **&lt; 0.3%** (Gmail Postmaster if you register the domain later).
- Send steadily; avoid sudden volume spikes.
- Do not import cold lists.

Refs: [Brevo sender requirements](https://help.brevo.com/hc/en-us/articles/14925263522578-Comply-with-Gmail-Yahoo-and-Microsoft-s-requirements-for-email-senders) · [Best practices](https://help.brevo.com/hc/en-us/articles/360020418259-Best-practices-for-email-deliverability)

## Acceptance

- [ ] Brevo Domains: mobilcab.com **Authenticated**
- [ ] From = `@mobilcab.com`
- [ ] Confirm + welcome subjects match this repo (no emoji)
- [ ] Test signup → confirm mail in **Inbox** (Gmail + Outlook)
- [ ] After confirm → welcome automation in Inbox
