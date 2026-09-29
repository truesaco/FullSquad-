# FullSquad: Competitive Scan

*Reviewed September 2026 from public websites, app-store listings, and pricing pages. These figures are the companies' own claims and weren't independently verified.*

## TL;DR

Most of the market falls into three groups:

1. **Pay-to-play pickup marketplaces** (GoodRec, Plei, MatchDay, Footy Addicts, Pezo). They sell spots in games they run, usually with strangers at booked fields.
2. **Hosting and ticketing tools** (JoGo.Team, OpenSports, ENDALGO, Meetup). These help someone host a game, but they're built around collecting money and RSVPs.
3. **Team-management apps** (Spond, TeamSnap, Heja). These are built for fixed rosters and youth teams, not for filling open spots.

**None of them combine these five things:**

- free for players
- the organizer's own crew goes first
- filling by position and skill ("keeper preferred" reaches actual keepers)
- a timed one-tap backfill that rolls to the next person
- joining from a link without downloading an app

That combination is FullSquad's gap, and the landing page now says so directly.

## Who's out there

| Product | Model | What they do well | Where they fall short for Diego |
|---|---|---|---|
| **GoodRec** | Players pay per game; hosted games in 70+ cities | Huge network (claims 1M players, 4.9★ with 20K+ reviews). Reliable games at good fields. | Players pay. 24-hour cancellation policy (App Store reviews describe refund fights). It replaces your crew instead of serving it. |
| **Plei** | Pay-to-play at partner facilities, plus free games with adidas | Strong soccer brand. More lenient refunds than GoodRec. | Same marketplace model: strangers, booked fields, per-game fees. |
| **MatchDay** | Premium organized pickup with AI-filmed matches and an on-site manager | Balanced teams and a polished experience | Premium price. Not for a crew's own Sunday run. |
| **Footy Addicts** (UK) | Find, book, and play casual games | Mature community (claims 76K+ players) | Booking and payment model. UK only. |
| **JoGo.Team** ⚠️ *closest competitor* | Free for hosts. Players usually pay $5–15 per game; some games are free. | RSVPs, auto-promoting waitlist, reminders, no-show tracking, balanced teams, automatic refunds. Pitches the same "200 messages" pain. | Built around payments and a public city directory. Skill is only a "tone" label (competitive or friendly), with no position matching. Alerts push you to the app. No crew-first stage. |
| **OpenSports** | Organizer platform: 3–5% plus $0.30 per ticket, and plans up to $750+/mo | Leagues, memberships, waitlists. 4.9★ on Google Play. | Pricing and complexity suit clubs, not a guy with a group chat. |
| **ENDALGO** | Community and group organizer for many sports | Free, and good for recurring groups | Generic events tool. No position logic or backfill flow. |
| **Spond / TeamSnap / Heja** | Team management | Availability, chat, payments for fixed teams | Built for rosters and parents, not for filling 2 open spots by Saturday. |
| **WhatsApp / GroupMe** | Free, and everyone's already there | Zero friction | Everything Diego hates: thumbs-up ≠ confirmation, manual cuts, begging for replacements. |

## Where FullSquad wins

| Gap in the market | FullSquad answer | Where it shows on the page |
|---|---|---|
| Everyone monetizes the player | $0 for players forever, and no payments at all, so there's nothing to refund | Pricing, FAQ, Compare |
| Nobody fills by **position** | "Keeper preferred" reaches keepers, and the balance check flags "No keeper yet" | Features 02 and 05, Compare |
| Your crew vs. strangers is all-or-nothing | Crew sees it first, then nearby players who fit | Feature 01, Compare |
| Backfills are a race or a manual beg | One-tap In/Pass that auto-rolls on a timer | Feature 04, Compare |
| App download required | A game link that works in any chat | Trust panel, FAQ, Compare |

## What I changed on the landing page because of this

1. **New "Built for the game you already run" comparison section.** It compares categories (group chat, pay-to-play apps, hosting apps) instead of naming brands. That keeps it honest and avoids trademark issues.
2. **"Post a game" is now a working mini-product, not a dead button.** Organizers build their post, see a live roster card, and copy a clean "who's in?" message for their group chat. That's useful today, before the app exists. Then they're asked to save an organizer spot, and the lead arrives with the game details attached, so you know their format, day, and field.
3. **A new FAQ:** "How is this different from pay-to-play pickup apps?"
4. **City personalization:** `?city=Miami` changes the hero badge to "Built for pickup crews in Miami" for local campaigns.
5. **Installable PWA manifest**, in line with the research doc's plan for a mobile-first web app.

## Recommendations for next

- **Spanish toggle (EN/ES).** The Broward and Miami audience, and the names in your own research, point to a lot of Spanish-first players. Competitors mostly treat Spanish as a separate market, not a toggle. This is a cheap differentiator.
- **City SEO pages** (`/pickup-soccer/miami`, `/pickup-soccer/fort-lauderdale`). GoodRec and JoGo get most of their organic traffic from pages like these.
- **Reliability as a headline.** JoGo already markets no-show tracking. FullSquad's "Shows up 11 of 12" signal is stronger, so consider showing it in the free tier, not only in Pro.
- **One-tap weather cancel** that notifies the whole roster. Small feature, big relief.
- **Swap the composite persona for real beta quotes** as soon as you have them. The page is already labeled honestly, per the PRD.
- **Optional "field split" display** that shows the organizer's Venmo or Zelle handle without processing money. It covers the common case without breaking the "we never touch payments" promise.

## Sources

- goodrec.com and its App Store listing (id1510554246), including reviews and developer responses
- plei.com
- playmatchday.com
- footyaddicts.com
- jogo.team, including its FAQ and comparison table
- opensports.net blog posts on pricing and fees, and opensports.ca/pricing
- endalgo.com
- teamlinkt.com "15 Best Apps for Sports Team Communication"
