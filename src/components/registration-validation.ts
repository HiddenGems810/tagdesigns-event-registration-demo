export interface RegistrationDetails {
  name: string;
  email: string;
  organization: string;
}

export type RegistrationField = "name" | "email";
export type RegistrationErrors = Partial<Record<RegistrationField | "ticket", string>>;

export function validateTicketSelection(ticketId: string): RegistrationErrors {
  return ticketId ? {} : { ticket: "Choose a demo pass to continue." };
}

export function validateRegistrationDetails(details: RegistrationDetails): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const normalizedEmail = details.email.trim();

  if (!details.name.trim()) errors.name = "Enter your full name to continue.";
  if (!normalizedEmail) errors.email = "Enter an email address to continue.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
    errors.email = "Enter an email address in the format name@example.com.";
  }

  return errors;
}
