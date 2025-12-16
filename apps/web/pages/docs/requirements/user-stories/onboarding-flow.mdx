# Onboarding Flow User Stories & Requirements

<!--
Status: Approved
Created: 2025-11-30
Issue: #15
Owner: Harry
-->

This document outlines the expected behavior for the user onboarding process, specifically focusing on the transition from signup to the homepage.

## 1. Account Creation & Initial State

- **US-1.1:** As a new user signing up via OAuth (Google/GitHub), I successfully create an account.
- **US-1.2:** As a new user signing up via Email/Password, I successfully create an account and am automatically logged in.
- **US-1.3:** Upon creation (via any method), my account has a default auto-generated username (e.g., `fast-flyer-909`).
    - _Note:_ Email/Password signups provide a name during signup, which is saved.
- **US-1.4:** My profile is marked as "incomplete" because `dateOfBirth` and `country` are missing.

## 2. Access Control (Middleware)

- **US-2.1:** As a logged-in user with an **incomplete** profile (missing `dateOfBirth` or `country`), if I attempt to visit the Homepage (`/`) or any other protected route, I am automatically redirected to `/auth/onboarding`.
- **US-2.2:** As a logged-in user with a **complete** profile, if I attempt to visit `/auth/onboarding`, I am automatically redirected to the Homepage (`/`).

## 3. The Onboarding Form

- **US-3.1:** As a user on the onboarding page, I see a form requesting:
    - Username (pre-filled with my current/auto-generated one, editable)
    - Date of Birth (required)
    - Country (required)
    - Bio (optional)
- **US-3.2:** As I type a username, I see real-time feedback on its availability.
    - _Constraint:_ If I type my _own_ current username, it shows as available/valid.
- **US-3.3:** If I have previously saved partial data (e.g., I set a username but didn't finish), the form fields pre-populate with that existing data so I don't have to re-enter it.

## 4. Form Submission & Completion

- **US-4.1:** When I click "Complete Profile":
    1. The application validates my inputs.
    2. My user record in the database is updated with the new values.
    3. **Critical:** My active session is immediately refreshed to reflect these changes (specifically the new `dateOfBirth` and `country`).
- **US-4.2:** After the save and session refresh are confirmed successful:
    - I am redirected to the Homepage (`/`).
    - The middleware recognizes my session is now complete and _allows_ access to the Homepage.
    - I am _not_ redirected back to `/auth/onboarding`.

## 5. Post-Onboarding Experience

- **US-5.1:** Once on the Homepage, I see my updated profile information (e.g., my chosen username) in the UI settings or profile section.
- **US-5.2:** I can log out and log back in, and my profile remains complete; I am taken directly to the Homepage, not onboarding.
