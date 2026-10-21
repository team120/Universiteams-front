# AGENTS.md

Universiteams web app: a platform for university research projects. Students and teachers publish projects; others browse them and request to join. Next.js 14 (App Router), React 18, Mantine 7, TanStack Query. The API lives in [team120/Universiteams](https://github.com/team120/Universiteams).

## Running checks

- Install: `npm ci`
- Tests: `npm run test` (Jest + Testing Library, in `__tests__/`)
- Lint: `npx next lint` (`npm run lint` applies fixes)
- Format: `npm run prettier-check`
- Typecheck: `npx tsc --noEmit`

Local setup is in `README.md`; env variables are documented in `.env.example`.

## Conventions

- Commits and PR titles follow Conventional Commits. PRs are squash-merged.
- Code, comments, commits, and docs are in English. UI text is in Spanish.
- The UI is tested by a separate Playwright framework, so the DOM is part of the contract.

## Review guidelines

### How to review

- Review the entire PR diff in one pass and report every finding at once, P0 through P3. Don't stop after the most severe ones; a later round should not find something that was already in the diff.
- On re-reviews, review the whole PR again, not only the new commits, and report everything still applicable in that single review.
- When you find a defect, check every other place in the diff where the same kind of defect can occur, and report each one.
- Also check these easy-to-miss areas:
  - Flows that change data: loading and error states, double submits, and cached data that goes stale after a mutation.
  - Every state of a component: empty, loading, error, long text, and each user role.
  - Every API call against the backend contract (routes, fields, and error responses).

### What to flag

Flag these as issues:

- A bug fix without a regression test that would fail without the fix.
- New logic (services, hooks, utils) or components without tests.
- New `any` types, or type assertions that hide a real type mismatch.
- UI text not in Spanish.
- Interactive elements that aren't semantic HTML: clickable `div`/`span` instead of `button` or `a`, inputs without a `label` or accessible name, missing headings or landmarks.
- Repeated or unnamed elements (cards, list rows, table cells) without a `data-testid`.
- `data-testid` values that aren't kebab-case `<component>-<element>` (e.g. `project-card-title`).
- A renamed or removed `data-testid` or accessible name that the PR description doesn't call out as a breaking change.
- Secrets or credentials in code; anything secret in a `NEXT_PUBLIC_` variable (those ship to the browser).
- Behavior or setup changes without updates to `README.md` or `.env.example`.
- New dependencies without a reason in the PR description.
- Changes that go beyond the PR's stated scope.

Don't flag formatting or lint style; CI enforces those.
