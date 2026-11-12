# TAGDesigns event registration demo

An original, self-contained portfolio app for three fictional event brands. It demonstrates white-label event discovery, agenda details, filtering, and a multi-step simulated registration.

## Run locally

Use Node.js 20.19 or newer and pnpm 10.14 or newer.

- Install dependencies: pnpm install
- Start the development server: pnpm dev
- Check TypeScript: pnpm typecheck
- Create the production build: pnpm build
- Preview the build: pnpm preview

## Architecture and data flow

EventRegistrationApp owns the selected brand, active event, filters, form values, validation, and registration step. BrandSwitcher, EventCard, EventDetailView, EventResults, RegistrationProgress, and RegistrationFlow divide the interface into focused pieces.

The typed theme records in src/data/event-themes.ts hold each brand's colors, typography, radius, and control border. src/data/event-registration-demo.ts maps those brands to fictional event, agenda, and pass data. Selecting a brand updates its CSS custom properties and its event data. Search, category, and date results are derived from the current brand's events.

Validation is kept in src/components/registration-validation.ts. Attendee data exists only in React memory for the current page session. The final step shows a local confirmation; the app does not send a request, save details, reserve a seat, or process payment.

## Styling and library choices

React and TypeScript provide typed view state and data contracts. Vite keeps the demo independently buildable. Sass owns the isolated .event-app theme layer and responsive rules. Tailwind is used for a small set of layout and accessibility utilities already present in the portfolio component. Lucide React supplies interface icons.

The controls use native HTML radios, search, selects, dates, buttons, fieldsets, and labels. The app has no dialog, command menu, or drawer that would benefit from a separate interaction-primitives package, so it does not add Radix, Base UI, or shadcn/ui. Brand tokens flow through CSS custom properties instead of duplicating the event UI.

## Accessibility

Controls have associated labels, theme and pass options use fieldsets and legends, validation is attached to the relevant fields, and changing views moves focus to the new heading. Status, empty, and failure messages use live regions. Focus rings are visible in every theme, and motion is reduced when the operating-system preference requests it.

Theme text, placeholders, and control boundaries were checked against WCAG contrast thresholds: 4.5:1 for ordinary text and 3:1 for component boundaries. This palette check does not replace a full accessibility audit with assistive technology.

## Verification

There is no committed unit-test runner. The repeatable project checks are pnpm typecheck and pnpm build. Browser verification should cover all three brands, text/category/date filters, agenda navigation, required-pass and invalid-email feedback, the review step, simulated failure and retry, confirmation, loading/empty/error states, and mobile through desktop layouts.

## Demo boundaries

All event, organization, and ticket content is fictional. There is no registration API, account, analytics, reservation, payment, or persistence in this standalone app. The attendee fields stay in page memory and are discarded when the page reloads or closes. Do not enter real personal information.

This is original TAGDesigns portfolio work. It does not represent RainFocus or another event provider and contains no client source code.
