## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke it.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
- YouTube research/transcription → launch the `video-transcript-researcher` subagent defined in `.opencode/agents/video-transcript-researcher.md`; use yt-dlp for captions and Browser Harness for visual checks, and report any viewing gaps honestly.

## Lead search workflow

- For any Serper lead search, start this project locally and use Browser Harness against the local app. Do not run lead queries from Serper Playground, curl, or a direct API script.
- Use the exact local port printed by `npm run dev`; port 3000 is currently occupied by another app, so Next.js selected 3002 during this validation.
- Keep searches small and explicit. Serper Places returns 10 results per page in the current Playground contract; one page is the default. Check the requested page count before running, since each page can consume a credit.
- The Places `location` value is free-form text. Enter and verify the region in the local form; do not depend on the legacy location-autocomplete endpoint.
- Treat Places and Instagram results as candidates, not qualified leads. Verify the company, business account, location, website status, and evidence before outreach.
- Do not contact, follow, message, or bulk-export leads automatically. Never send Serper API keys through chat or client-side code; keep them in `.env.local` and rotate any key shown in a screenshot or log.
