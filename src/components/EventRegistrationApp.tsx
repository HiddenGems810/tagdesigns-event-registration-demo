import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type RefObject } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  MapPin,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  eventsByTheme,
  type DemoEvent,
} from "../data/event-registration-demo";
import { eventThemes, type EventTheme, type EventThemeId } from "../data/event-themes";
import {
  validateRegistrationDetails,
  validateTicketSelection,
  type RegistrationDetails,
  type RegistrationErrors,
  type RegistrationField,
} from "./registration-validation";
import "../styles/event-registration.scss";

type DemoView = "browse" | "detail" | "registration" | "confirmation";
type FeedState = "ready" | "loading" | "error";
type AttendeeField = RegistrationField | "organization";
type Attendee = RegistrationDetails;
type FieldErrors = RegistrationErrors;
type EventStyle = CSSProperties & Record<`--${string}`, string>;

const emptyAttendee: Attendee = { name: "", email: "", organization: "" };

function dateParts(isoDate: string) {
  const date = new Date(`${isoDate}T12:00:00`);
  return {
    day: new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
    full: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date),
  };
}

function themeStyle(theme: EventTheme): EventStyle {
  return {
    "--event-canvas": theme.canvas,
    "--event-surface": theme.surface,
    "--event-ink": theme.ink,
    "--event-muted": theme.muted,
    "--event-border": theme.border,
    "--event-accent": theme.accent,
    "--event-accent-ink": theme.accentInk,
    "--event-heading-font": theme.headingFont,
    "--event-body-font": theme.bodyFont,
    "--event-radius": theme.radius,
  };
}

function BrandSwitcher({
  selectedTheme,
  onSelect,
}: {
  selectedTheme: EventThemeId;
  onSelect: (themeId: EventThemeId) => void;
}) {
  return (
    <fieldset className="event-app__theme-control">
      <legend className="event-app__theme-label">Preview a brand</legend>
      {eventThemes.map((theme) => (
        <label className="event-app__theme-choice" key={theme.id}>
          <input
            type="radio"
            name="event-demo-theme"
            value={theme.id}
            checked={selectedTheme === theme.id}
            onChange={() => onSelect(theme.id)}
          />
          <span>{theme.brandName}</span>
        </label>
      ))}
    </fieldset>
  );
}

function EventCard({
  event,
  onOpen,
}: {
  event: DemoEvent;
  onOpen: (eventId: string) => void;
}) {
  const date = dateParts(event.date);

  return (
    <article className="event-app__event-card">
      <time className="event-app__event-date" dateTime={event.date} aria-label={date.full}>
        <strong>{date.day}</strong>
        <span>{date.month}</span>
      </time>
      <div>
        <h3 className="event-app__event-title">{event.title}</h3>
        <p className="event-app__event-summary">{event.summary}</p>
        <div className="event-app__event-tags">
          <span className="event-app__event-tag">{event.category}</span>
          <span className="event-app__event-tag">{event.format}</span>
        </div>
      </div>
      <div className="event-app__event-card-footer">
        <span>
          <MapPin aria-hidden="true" className="mr-1 inline h-3.5 w-3.5" />
          {event.location}
        </span>
        <button
          className="event-app__primary-button"
          type="button"
          onClick={() => onOpen(event.id)}
          aria-label={`Event details: ${event.title}`}
        >
          Event details <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}

function EventDetailView({
  event,
  headingRef,
  onBack,
  onRegister,
}: {
  event: DemoEvent;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onRegister: () => void;
}) {
  const date = dateParts(event.date);

  return (
    <section className="event-app__view" aria-labelledby="event-detail-title">
      <button className="event-app__back-link" type="button" onClick={onBack}>
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to events
      </button>
      <div className="event-app__detail-banner">
        <span className="event-app__detail-date"><time dateTime={event.date}>{date.full}</time> · {event.length}</span>
        <h1 className="event-app__detail-title" id="event-detail-title" ref={headingRef} tabIndex={-1}>
          {event.title}
        </h1>
        <p className="event-app__detail-summary">{event.summary}</p>
        <dl className="event-app__detail-meta">
          <div>
            <dt>Location</dt>
            <dd>{event.location}</dd>
          </div>
          <div>
            <dt>Format</dt>
            <dd>{event.format}</dd>
          </div>
          <div>
            <dt>Venue</dt>
            <dd>{event.venue}</dd>
          </div>
        </dl>
      </div>

      <section className="event-app__agenda" aria-labelledby="event-agenda-title">
        <div className="event-app__agenda-heading">
          <h2 id="event-agenda-title">Agenda</h2>
          <span><CalendarDays aria-hidden="true" className="mr-1 inline h-3.5 w-3.5" /> Sample schedule</span>
        </div>
        {event.agenda.map((item) => (
          <article className="event-app__agenda-item" key={`${item.time}-${item.title}`}>
            <div className="event-app__agenda-time">
              <span className="sr-only">{item.day}, </span>{item.time}
            </div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
            <span className="event-app__agenda-track">{item.track}</span>
          </article>
        ))}
      </section>

      <div className="event-app__detail-actions">
        <p className="event-app__privacy-note">
          Fictional event. Registration below is a local demo and will not reserve a seat or send data.
        </p>
        <button className="event-app__primary-button" type="button" onClick={onRegister}>
          Continue to demo registration <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function RegistrationProgress({ currentStep }: { currentStep: number }) {
  const steps = ["Pass", "Details", "Review"];

  return (
    <ol className="event-app__progress" aria-label="Registration progress">
      {steps.map((step, index) => {
        const state = index < currentStep ? "complete" : index === currentStep ? "current" : "upcoming";
        return (
          <li className="event-app__progress-step" data-state={state} key={step}>
            <span className="sr-only">Step {index + 1}: </span>
            {state === "complete" ? <Check aria-hidden="true" className="mr-1 inline h-3.5 w-3.5" /> : null}
            {step}
            {state === "current" ? <span className="sr-only">, current step</span> : null}
          </li>
        );
      })}
    </ol>
  );
}

function RegistrationFlow({
  event,
  step,
  attendee,
  ticketId,
  errors,
  isSubmitting,
  submissionError,
  simulateNextFailure,
  headingRef,
  onAttendeeChange,
  onTicketChange,
  onSimulateFailureChange,
  onContinue,
  onBack,
  onCancel,
  onConfirm,
}: {
  event: DemoEvent;
  step: number;
  attendee: Attendee;
  ticketId: string;
  errors: FieldErrors;
  isSubmitting: boolean;
  submissionError: string | null;
  simulateNextFailure: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onAttendeeChange: (field: AttendeeField, value: string) => void;
  onTicketChange: (ticket: string) => void;
  onSimulateFailureChange: (enabled: boolean) => void;
  onContinue: () => void;
  onBack: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const selectedTicket = event.tickets.find((ticket) => ticket.id === ticketId);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < 2) onContinue();
    else onConfirm();
  }

  return (
    <section className="event-app__view" aria-labelledby="registration-title">
      <button className="event-app__back-link" type="button" onClick={onCancel}>
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to event details
      </button>
      <p className="event-app__eyebrow">// Demo registration · {event.title}</p>
      <h1 className="event-app__view-title" id="registration-title" ref={headingRef} tabIndex={-1}>
        Reserve a demo pass.
      </h1>
      <p className="event-app__view-intro">
        This is a portfolio simulation. No payment is requested, no seat is held, and the attendee details stay in this browser tab.
      </p>
      <RegistrationProgress currentStep={step} />

      <form className="event-app__step-panel" noValidate onSubmit={handleSubmit}>
        {step === 0 ? (
          <>
            <h2>Choose a pass</h2>
            <p>All options are sample data. There is no checkout or payment processing.</p>
            <fieldset className="event-app__ticket-options" aria-required="true" aria-describedby={errors.ticket ? "ticket-error" : undefined}>
              <legend className="event-app__field-label">Pass type</legend>
              {event.tickets.map((ticket) => (
                <label className="event-app__ticket-option" key={ticket.id}>
                  <input
                    type="radio"
                    name="demo-ticket"
                    value={ticket.id}
                    checked={ticketId === ticket.id}
                    onChange={() => onTicketChange(ticket.id)}
                    aria-invalid={Boolean(errors.ticket)}
                  />
                  <span>
                    <strong>{ticket.name}</strong>
                    <small>{ticket.detail}</small>
                  </span>
                  <span className="event-app__ticket-price">{ticket.priceLabel}</span>
                </label>
              ))}
            </fieldset>
            {errors.ticket ? <span className="event-app__field-error" id="ticket-error" role="alert">{errors.ticket}</span> : null}
          </>
        ) : null}

        {step === 1 ? (
          <>
            <h2>Attendee details</h2>
            <p>These fields are used only to complete the on-screen preview. Attendee details are not sent or saved.</p>
            <div className="event-app__form-grid">
              <div className="event-app__field event-app__field--wide">
                <label htmlFor="event-attendee-name">Full name <span aria-hidden="true">*</span></label>
                <input
                  autoComplete="name"
                  id="event-attendee-name"
                  name="name"
                  type="text"
                  value={attendee.name}
                  onChange={(e) => onAttendeeChange("name", e.target.value)}
                  aria-required="true"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "event-attendee-name-error" : undefined}
                />
                {errors.name ? <span className="event-app__field-error" id="event-attendee-name-error">{errors.name}</span> : null}
              </div>
              <div className="event-app__field">
                <label htmlFor="event-attendee-email">Email address <span aria-hidden="true">*</span></label>
                <input
                  autoComplete="email"
                  id="event-attendee-email"
                  name="email"
                  type="email"
                  value={attendee.email}
                  onChange={(e) => onAttendeeChange("email", e.target.value)}
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "event-attendee-email-error" : undefined}
                />
                {errors.email ? <span className="event-app__field-error" id="event-attendee-email-error">{errors.email}</span> : null}
              </div>
              <div className="event-app__field">
                <label htmlFor="event-attendee-organization">Organization <span className="normal-case tracking-normal">(optional)</span></label>
                <input
                  autoComplete="organization"
                  id="event-attendee-organization"
                  name="organization"
                  type="text"
                  value={attendee.organization}
                  onChange={(e) => onAttendeeChange("organization", e.target.value)}
                />
              </div>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2>Review the demo</h2>
            <p>Confirming advances to a local confirmation screen. No registration service is connected.</p>
            <dl className="event-app__review-list">
              <dt>Event</dt><dd>{event.title}</dd>
              <dt>Date</dt><dd>{dateParts(event.date).full}</dd>
              <dt>Pass</dt><dd>{selectedTicket?.name ?? "No pass selected"}</dd>
              <dt>Attendee</dt><dd>{attendee.name}</dd>
              <dt>Email</dt><dd>{attendee.email}</dd>
              {attendee.organization ? <><dt>Organization</dt><dd>{attendee.organization}</dd></> : null}
            </dl>
            <p className="event-app__privacy-note">
              This page does not send form data to an API, write it to storage, or contact the fictional event organizer.
            </p>
            <label className="event-app__preview-failure">
              <input
                type="checkbox"
                checked={simulateNextFailure}
                onChange={(e) => onSimulateFailureChange(e.target.checked)}
              />
              <span>Preview a failed registration response on the next attempt.</span>
            </label>
            {submissionError ? <div className="event-app__registration-error" role="alert">{submissionError}</div> : null}
          </>
        ) : null}

        <div className="event-app__form-actions">
          {step === 0 ? (
            <button className="event-app__secondary-button" type="button" onClick={onCancel}>Back to event</button>
          ) : (
            <button className="event-app__secondary-button" type="button" onClick={onBack} disabled={isSubmitting}>
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Previous step
            </button>
          )}
          {step < 2 ? (
            <button className="event-app__primary-button" type="submit">Continue <ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
          ) : (
            <button className="event-app__primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><span className="event-app__spinner" aria-hidden="true" /> Processing demo</> : submissionError ? "Retry demo registration" : "Complete demo registration"}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function EventResults({
  events,
  feedState,
  hasFilters,
  dateRangeError,
  onOpen,
  onReset,
  onRetry,
}: {
  events: DemoEvent[];
  feedState: FeedState;
  hasFilters: boolean;
  dateRangeError: boolean;
  onOpen: (eventId: string) => void;
  onReset: () => void;
  onRetry: () => void;
}) {
  if (feedState === "loading") {
    return (
      <div className="event-app__loading-state" role="status" aria-live="polite" aria-busy="true">
        <h3>Refreshing the sample schedule…</h3>
        <p>The preview is loading local demonstration data.</p>
        <div className="event-app__skeletons" aria-hidden="true"><div className="event-app__skeleton" /><div className="event-app__skeleton" /><div className="event-app__skeleton" /></div>
      </div>
    );
  }

  if (feedState === "error") {
    return (
      <div className="event-app__feed-error" role="alert">
        <h3>We couldn't load this schedule.</h3>
        <p>This is a simulated feed failure. The demo uses local sample data and does not contact an event service.</p>
        <button className="event-app__secondary-button" type="button" onClick={onRetry}>
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> Retry sample schedule
        </button>
      </div>
    );
  }

  if (dateRangeError || events.length === 0) {
    return (
      <div className="event-app__empty-state" role="status" aria-live="polite">
        <h3>{dateRangeError ? "Check the date range." : "No events match those filters."}</h3>
        <p>{dateRangeError ? "The end date needs to be the same as or later than the start date." : "Try a broader search, choose a different category, or clear the filters."}</p>
        {hasFilters ? <button className="event-app__secondary-button" type="button" onClick={onReset}>Clear filters</button> : null}
      </div>
    );
  }

  return (
    <ul className="event-app__event-grid" aria-label="Events">
      {events.map((event) => (
        <li key={event.id}>
          <EventCard event={event} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  );
}

export function EventRegistrationApp() {
  const [themeId, setThemeId] = useState<EventThemeId>("signal-forum");
  const [view, setView] = useState<DemoView>("browse");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [forceEmpty, setForceEmpty] = useState(false);
  const [feedState, setFeedState] = useState<FeedState>("ready");
  const [step, setStep] = useState(0);
  const [ticketId, setTicketId] = useState("");
  const [attendee, setAttendee] = useState<Attendee>(emptyAttendee);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [simulateNextFailure, setSimulateNextFailure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hasMounted = useRef(false);
  const loadingTimer = useRef<number | null>(null);
  const submitTimer = useRef<number | null>(null);

  const theme = eventThemes.find((candidate) => candidate.id === themeId) ?? eventThemes.find((candidate) => candidate.id === "signal-forum")!;
  const events = eventsByTheme[themeId];
  const selectedEvent = events.find((event) => event.id === selectedEventId);
  const selectedTicket = selectedEvent?.tickets.find((ticket) => ticket.id === ticketId);
  const dateRangeError = Boolean(fromDate && toDate && fromDate > toDate);
  const hasFilters = Boolean(query || category !== "all" || fromDate || toDate || forceEmpty);

  const categories = useMemo(
    () => Array.from(new Set(events.map((event) => event.category))).sort((a, b) => a.localeCompare(b)),
    [events],
  );

  const filteredEvents = useMemo(() => {
    if (forceEmpty || dateRangeError) return [];
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return events.filter((event) => {
      const matchesQuery = !normalizedQuery || [
        event.title,
        event.summary,
        event.category,
        event.format,
        event.location,
        event.venue,
      ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
      const matchesCategory = category === "all" || event.category === category;
      const matchesStart = !fromDate || event.date >= fromDate;
      const matchesEnd = !toDate || event.date <= toDate;
      return matchesQuery && matchesCategory && matchesStart && matchesEnd;
    });
  }, [category, dateRangeError, events, forceEmpty, fromDate, query, toDate]);

  const variables = useMemo(() => themeStyle(theme), [theme]);

  useEffect(() => {
    if (hasMounted.current) titleRef.current?.focus();
    else hasMounted.current = true;
  }, [view, step]);

  useEffect(() => () => {
    if (loadingTimer.current !== null) window.clearTimeout(loadingTimer.current);
    if (submitTimer.current !== null) window.clearTimeout(submitTimer.current);
  }, []);

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setFromDate("");
    setToDate("");
    setForceEmpty(false);
  }

  function handleThemeChange(nextThemeId: EventThemeId) {
    if (loadingTimer.current !== null) window.clearTimeout(loadingTimer.current);
    setThemeId(nextThemeId);
    setView("browse");
    setSelectedEventId(null);
    setFeedState("ready");
    clearFilters();
    setStep(0);
    setTicketId("");
    setAttendee(emptyAttendee);
    setErrors({});
    setSubmissionError(null);
    setSimulateNextFailure(false);
  }

  function openEvent(eventId: string) {
    setSelectedEventId(eventId);
    setView("detail");
  }

  function startRegistration() {
    setStep(0);
    setTicketId("");
    setAttendee(emptyAttendee);
    setErrors({});
    setSubmissionError(null);
    setSimulateNextFailure(false);
    setView("registration");
  }

  function backToEvents() {
    setView("browse");
    setSelectedEventId(null);
    setStep(0);
    setTicketId("");
    setAttendee(emptyAttendee);
    setErrors({});
    setSubmissionError(null);
    setSimulateNextFailure(false);
  }

  function continueRegistration() {
    if (step === 0) {
      const ticketErrors = validateTicketSelection(ticketId);
      if (Object.keys(ticketErrors).length > 0) {
        setErrors(ticketErrors);
        window.requestAnimationFrame(() => document.querySelector<HTMLElement>(".event-app input[name='demo-ticket']")?.focus());
        return;
      }
      setErrors({});
      setStep(1);
      return;
    }

    const nextErrors = validateRegistrationDetails(attendee);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      window.requestAnimationFrame(() => document.querySelector<HTMLElement>(".event-app input[aria-invalid='true']")?.focus());
      return;
    }

    setErrors({});
    setSubmissionError(null);
    setStep(2);
  }

  function confirmRegistration() {
    if (!selectedEvent || !selectedTicket) return;
    setSubmissionError(null);
    setIsSubmitting(true);
    if (submitTimer.current !== null) window.clearTimeout(submitTimer.current);
    submitTimer.current = window.setTimeout(() => {
      setIsSubmitting(false);
      if (simulateNextFailure) {
        setSubmissionError("The demo service returned a simulated error. No registration was created; you can retry this step.");
        setSimulateNextFailure(false);
        return;
      }
      setAttendee(emptyAttendee);
      setView("confirmation");
    }, 450);
  }

  function previewFeedState(nextState: "loading" | "error") {
    if (loadingTimer.current !== null) window.clearTimeout(loadingTimer.current);
    setForceEmpty(false);
    if (nextState === "error") {
      setFeedState("error");
      return;
    }
    setFeedState("loading");
    loadingTimer.current = window.setTimeout(() => setFeedState("ready"), 900);
  }

  function retryFeed() {
    setFeedState("loading");
    if (loadingTimer.current !== null) window.clearTimeout(loadingTimer.current);
    loadingTimer.current = window.setTimeout(() => setFeedState("ready"), 500);
  }

  function handleAttendeeChange(field: AttendeeField, value: string) {
    setAttendee((current) => ({ ...current, [field]: value }));
    if (field !== "organization") {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  return (
    <div className="event-app" data-theme={theme.id} style={variables} data-testid="event-registration-app">
      <div className="event-app__shell">
        <div className="event-app__notice" role="note">
          <span className="event-app__notice-mark" aria-hidden="true">//</span>
          <span><strong>Portfolio demo.</strong> Events and passes are fictional. No payment is taken, no seat is reserved, and no attendee details are submitted.</span>
        </div>

        <header className="event-app__topbar">
          <div className="event-app__brand-lockup" role="group" aria-label={`${theme.brandName}: ${theme.tagline}`}>
            <span className="event-app__brand-mark" aria-hidden="true">{theme.mark}</span>
            <span>
              <span className="event-app__brand-name">{theme.brandName}</span>
              <span className="event-app__brand-tagline">{theme.tagline}</span>
            </span>
          </div>
          <BrandSwitcher selectedTheme={themeId} onSelect={handleThemeChange} />
        </header>

        {view === "browse" ? (
          <>
            <section className="event-app__hero" aria-labelledby="event-discovery-title">
              <div>
                <p className="event-app__eyebrow">// Gather · Learn · Make progress</p>
                <h1 className="event-app__hero-title" id="event-discovery-title" ref={titleRef} tabIndex={-1}>
                  Find the room <em>for your next idea.</em>
                </h1>
                <p className="event-app__hero-copy">
                  A flexible event experience for {theme.brandName}. Explore the schedule, compare formats, and open an agenda before starting a demo registration.
                </p>
              </div>
              <span className="event-app__hero-index" aria-hidden="true">03<br />/ 27</span>
            </section>

            <section aria-labelledby="event-list-title">
              <div className="event-app__section-heading">
                <div>
                  <p className="event-app__eyebrow">// The calendar</p>
                  <h2 id="event-list-title">Explore the schedule</h2>
                </div>
                <p>{events.length} sample events · 2027</p>
              </div>

              <div className="event-app__filters" role="search" aria-label="Filter events">
                <div className="event-app__field">
                  <label htmlFor="event-search">Search events</label>
                  <div className="relative">
                    <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--event-muted)]" />
                    <input
                      className="!pl-9"
                      id="event-search"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Title, place, topic…"
                    />
                  </div>
                </div>
                <div className="event-app__field">
                  <label htmlFor="event-category">Category</label>
                  <select id="event-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="all">All categories</option>
                    {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div className="event-app__field">
                  <label htmlFor="event-from">From date</label>
                  <input id="event-from" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div className="event-app__field">
                  <label htmlFor="event-until">Through date</label>
                  <input id="event-until" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
              </div>
              {dateRangeError ? <p className="event-app__filter-error" role="alert">Through date must be the same as or later than the from date.</p> : null}

              <div className="event-app__results-meta" aria-live="polite" aria-atomic="true">
                <span>
                  {feedState === "ready"
                    ? `${filteredEvents.length} ${filteredEvents.length === 1 ? "event" : "events"} shown`
                    : "Schedule status updated"}
                </span>
                {hasFilters ? <button className="event-app__text-button" type="button" onClick={clearFilters}>Clear search and filters <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /></button> : <span>All dates</span>}
              </div>

              <EventResults
                events={filteredEvents}
                feedState={feedState}
                hasFilters={hasFilters}
                dateRangeError={dateRangeError}
                onOpen={openEvent}
                onReset={clearFilters}
                onRetry={retryFeed}
              />

              <details className="event-app__preview-controls">
                <summary>Preview loading, empty, and failure states</summary>
                <div className="event-app__preview-actions">
                  <button className="event-app__secondary-button" type="button" onClick={() => previewFeedState("loading")}>Show loading state</button>
                  <button className="event-app__secondary-button" type="button" onClick={() => previewFeedState("error")}>Show feed failure</button>
                  <button className="event-app__secondary-button" type="button" onClick={() => { setFeedState("ready"); setForceEmpty(true); }}>Show empty state</button>
                  <button className="event-app__text-button" type="button" onClick={() => { setFeedState("ready"); setForceEmpty(false); }}>Restore results</button>
                </div>
              </details>
            </section>
          </>
        ) : null}

        {view === "detail" && selectedEvent ? (
          <EventDetailView
            event={selectedEvent}
            headingRef={titleRef}
            onBack={() => setView("browse")}
            onRegister={startRegistration}
          />
        ) : null}

        {view === "registration" && selectedEvent ? (
          <RegistrationFlow
            event={selectedEvent}
            step={step}
            attendee={attendee}
            ticketId={ticketId}
            errors={errors}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
            simulateNextFailure={simulateNextFailure}
            headingRef={titleRef}
            onAttendeeChange={handleAttendeeChange}
            onTicketChange={(nextTicket) => { setTicketId(nextTicket); setErrors({}); }}
            onSimulateFailureChange={setSimulateNextFailure}
            onContinue={continueRegistration}
            onBack={() => { setStep((current) => Math.max(0, current - 1)); setErrors({}); setSubmissionError(null); }}
            onCancel={() => setView("detail")}
            onConfirm={confirmRegistration}
          />
        ) : null}

        {view === "confirmation" && selectedEvent ? (
          <section className="event-app__view event-app__confirmation" aria-labelledby="registration-confirmation-title" role="status">
            <span className="event-app__confirmation-mark"><Check aria-hidden="true" className="h-6 w-6" /></span>
            <p className="event-app__eyebrow">// Demo flow complete</p>
            <h1 className="event-app__view-title" id="registration-confirmation-title" ref={titleRef} tabIndex={-1}>
              Registration simulated.
            </h1>
            <p className="event-app__view-intro">
              The flow is complete for <strong>{selectedEvent.title}</strong>. No seat was reserved, no payment was taken, and the attendee details were not sent or saved.
            </p>
            <button className="event-app__primary-button mt-6" type="button" onClick={backToEvents}>
              Return to events <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </section>
        ) : null}

        <footer className="mt-12 border-t border-[var(--event-border)] pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--event-muted)]">
          <p className="m-0">Original portfolio product · {theme.brandName} is a fictional sample brand</p>
        </footer>
      </div>
    </div>
  );
}
