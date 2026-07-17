# Koloqua AI Language Lab

Koloqua AI is a community-powered platform for collecting, translating, recording, and independently validating Koloqua speech and text. The pilot is designed for schools, instructors, contributors, reviewers, language experts, and project administrators in Liberia.

## What this release includes

- **Role-based access control** with demo accounts for contributors, reviewers, and admins.
- **Secure sign-in/sign-up** with client-side password strength checks and input sanitization.
- **National pilot dashboard** with collection progress and quality metrics.
- **Prepared-sentence contribution tasks** with in-browser voice recording.
- **Koloqua transcription and Standard English pairing**.
- **Consent center** with revocable consent history and guardian-flow support.
- **Independent review queue** with approve/reject/correction actions and quality flags.
- **Partner-school management** with verified institution cards.
- **Campaign management** for themed collection drives.
- **Contributor rewards ledger** with validated payout requests.
- **Audit log** for sensitive actions and governance review.
- **Dataset export center** for versioned JSON/CSV/WAV releases.
- **Admin controls** for invites, quality checks, dataset policy, and security headers.
- **Responsive phone and desktop layouts** with accessible focus states.

All numbers, institutions, balances, and submissions shown in this prototype are demonstration data. No real payment, identity verification, or cloud audio upload occurs yet.

## Demo accounts

| Role        | Email                         | Password       |
|-------------|-------------------------------|----------------|
| Contributor | `contributor@koloqua.test`    | `REDACTED_DEMO_PASSWORD` |
| Reviewer    | `reviewer@koloqua.test`       | `REDACTED_DEMO_PASSWORD` |
| Admin       | `admin@koloqua.test`          | `REDACTED_DEMO_PASSWORD` |

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build and lint

```bash
npm run build
npm run lint
```

## Production roadmap

1. Add PostgreSQL and encrypted object storage for audio.
2. Replace the demo auth provider with invitation-based authentication and server-side sessions.
3. Implement institution, campaign, task, consent, review, and audit-log APIs.
4. Add duplicate-audio, silence, duration, and synthetic-voice checks on the server.
5. Require guardian consent workflows for contributors under 18.
6. Add dataset versioning and export approved WAV/JSON/CSV records.
7. Pilot Whisper fine-tuning only after the dataset and evaluation split are frozen.
8. Activate payments only after funding, identity checks, and mobile-money agreements.

## Security measures in this version

- **Next.js security headers** in `next.config.ts`:
  - `Content-Security-Policy`
  - `Strict-Transport-Security`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` restricting camera and geolocation, allowing microphone only for self.
- **`X-Powered-By` disabled** to reduce fingerprinting.
- **Client-side input sanitization** and injection-pattern detection in `app/lib/security.ts`.
- **Zod-based form validation** for contributions, reviews, and payouts.
- **Password strength requirements** for demo registration.
- **Role-based navigation** so users only see permitted views.

## Data governance principles

- Informed, revocable consent
- Minimal personal-data collection
- Clear separation between identity data and language data
- Two independent reviews before training eligibility
- Community participation in spelling and usage standards
- Dataset access licenses approved by project governance
- No voice cloning without separate, explicit consent

## Suggested production entities

`User`, `Institution`, `Membership`, `Campaign`, `Task`, `Prompt`, `Contribution`, `AudioAsset`, `ConsentRecord`, `Review`, `Dispute`, `LanguageVariant`, `RewardLedger`, `Payout`, `DatasetRelease`, and `AuditEvent`.

## Project tagline

> Preserving Liberia's voice and preparing it for the age of AI.
