import type { EventThemeId } from "./event-themes";

export interface AgendaItem {
  day: string;
  time: string;
  title: string;
  detail: string;
  track: string;
}

export interface TicketOption {
  id: string;
  name: string;
  detail: string;
  priceLabel: string;
}

export interface DemoEvent {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  format: string;
  venue: string;
  location: string;
  length: string;
  agenda: AgendaItem[];
  tickets: TicketOption[];
}

export const eventsByTheme: Record<EventThemeId, DemoEvent[]> = {
  "field-assembly": [
    {
      id: "field-climate-crops",
      title: "Field Notes: Climate & Crops",
      summary: "Growers, researchers, and designers share practical responses to a changing climate.",
      date: "2027-04-14",
      category: "Climate",
      format: "In person",
      venue: "Lone Star Hall",
      location: "Austin, Texas",
      length: "One day",
      agenda: [
        { day: "Wednesday · April 14", time: "9:00 AM", title: "Opening field notes", detail: "A shared map of the questions shaping this season.", track: "Main room" },
        { day: "Wednesday · April 14", time: "11:15 AM", title: "Soil as infrastructure", detail: "Short talks on practical, place-led soil health work.", track: "Working session" },
        { day: "Wednesday · April 14", time: "2:00 PM", title: "From trial to practice", detail: "Small groups turn a field experiment into a next step.", track: "Roundtable" },
      ],
      tickets: [
        { id: "field-community", name: "Community pass", detail: "Full-day program and shared lunch.", priceLabel: "Demo pass · no payment" },
        { id: "field-student", name: "Student pass", detail: "Full-day program for current students.", priceLabel: "Demo pass · no payment" },
      ],
    },
    {
      id: "regenerative-supply",
      title: "Regenerative Supply Day",
      summary: "A working session for teams building more resilient food and material supply chains.",
      date: "2027-05-05",
      category: "Food systems",
      format: "Hybrid",
      venue: "Union Station Workshop",
      location: "Raleigh, North Carolina",
      length: "One day",
      agenda: [
        { day: "Wednesday · May 5", time: "9:30 AM", title: "Map the chain", detail: "Trace a product from source to its everyday use.", track: "Main room" },
        { day: "Wednesday · May 5", time: "12:00 PM", title: "Better handoffs", detail: "Compare practical ways to share context across partners.", track: "Workshop" },
        { day: "Wednesday · May 5", time: "3:00 PM", title: "Commit to one change", detail: "Leave with a small, measurable next step.", track: "Roundtable" },
      ],
      tickets: [
        { id: "supply-inperson", name: "In-person pass", detail: "Attend the full workshop on site.", priceLabel: "Demo pass · no payment" },
        { id: "supply-remote", name: "Remote pass", detail: "Join the main sessions online.", priceLabel: "Demo pass · no payment" },
      ],
    },
    {
      id: "waterways-session",
      title: "Waterways / Working Session",
      summary: "Local teams explore how public space, water, and everyday infrastructure meet.",
      date: "2027-06-22",
      category: "Public space",
      format: "In person",
      venue: "Harbor Exchange",
      location: "Milwaukee, Wisconsin",
      length: "Half day",
      agenda: [
        { day: "Tuesday · June 22", time: "10:00 AM", title: "Read the shoreline", detail: "A guided introduction to the working waterfront.", track: "Field walk" },
        { day: "Tuesday · June 22", time: "1:00 PM", title: "Sketch the access points", detail: "Make barriers and opportunities visible together.", track: "Workshop" },
      ],
      tickets: [
        { id: "waterways-general", name: "Workshop pass", detail: "Join the field walk and working session.", priceLabel: "Demo pass · no payment" },
      ],
    },
  ],
  "signal-forum": [
    {
      id: "systems-in-practice",
      title: "Systems in Practice",
      summary: "Product and engineering teams share the small decisions that make software easier to use.",
      date: "2027-04-28",
      category: "Engineering",
      format: "In person",
      venue: "The Foundry Room",
      location: "St. Louis, Missouri",
      length: "One day",
      agenda: [
        { day: "Wednesday · April 28", time: "9:15 AM", title: "Interfaces under pressure", detail: "Designing useful states for real operational work.", track: "Main stage" },
        { day: "Wednesday · April 28", time: "11:30 AM", title: "The component contract", detail: "Agree on behavior before polishing the surface.", track: "Engineering" },
        { day: "Wednesday · April 28", time: "2:15 PM", title: "Fix the rough edge", detail: "A hands-on review of a small, imperfect flow.", track: "Studio" },
      ],
      tickets: [
        { id: "systems-practitioner", name: "Practitioner pass", detail: "Full day of talks and working sessions.", priceLabel: "Demo pass · no payment" },
        { id: "systems-team", name: "Team pass", detail: "A shared demo pass for a small team.", priceLabel: "Demo pass · no payment" },
      ],
    },
    {
      id: "interface-practice",
      title: "Interface Practice",
      summary: "A compact gathering about accessible patterns, clear content, and reliable front-end work.",
      date: "2027-05-19",
      category: "Design",
      format: "Hybrid",
      venue: "Switchyard Studio",
      location: "Chicago, Illinois",
      length: "One day",
      agenda: [
        { day: "Wednesday · May 19", time: "10:00 AM", title: "The useful default", detail: "Choosing interaction patterns that help the widest group.", track: "Main stage" },
        { day: "Wednesday · May 19", time: "1:00 PM", title: "Design tokens in the browser", detail: "Turn a theme into a consistent working interface.", track: "Workshop" },
        { day: "Wednesday · May 19", time: "3:30 PM", title: "What we checked", detail: "Share evidence, gaps, and next browser checks.", track: "Roundtable" },
      ],
      tickets: [
        { id: "interface-inperson", name: "Studio pass", detail: "Attend on site and join the workshop.", priceLabel: "Demo pass · no payment" },
        { id: "interface-remote", name: "Remote pass", detail: "Join the talks and group discussion online.", priceLabel: "Demo pass · no payment" },
      ],
    },
    {
      id: "open-web-assembly",
      title: "Open Web Assembly",
      summary: "Maintainers, designers, and builders compare notes on an open and durable web.",
      date: "2027-06-10",
      category: "Community",
      format: "Virtual",
      venue: "Online session",
      location: "Join from anywhere",
      length: "Half day",
      agenda: [
        { day: "Thursday · June 10", time: "10:00 AM", title: "The web we maintain", detail: "What makes a useful project sustainable over time.", track: "Main room" },
        { day: "Thursday · June 10", time: "12:30 PM", title: "Small tools, shared care", detail: "A practical conversation about stewardship.", track: "Open session" },
      ],
      tickets: [
        { id: "web-assembly", name: "Community pass", detail: "Join all virtual sessions.", priceLabel: "Demo pass · no payment" },
      ],
    },
  ],
  "common-ground": [
    {
      id: "public-places",
      title: "Public Places / 2027",
      summary: "Practitioners share approaches to welcoming, useful public spaces shaped with their neighbors.",
      date: "2027-04-21",
      category: "Civic design",
      format: "In person",
      venue: "Civic Assembly Hall",
      location: "Detroit, Michigan",
      length: "One day",
      agenda: [
        { day: "Wednesday · April 21", time: "9:00 AM", title: "Who is this place for?", detail: "Start with the people who use the space every day.", track: "Main room" },
        { day: "Wednesday · April 21", time: "11:00 AM", title: "Listen before the plan", detail: "Methods for turning local knowledge into design inputs.", track: "Workshop" },
        { day: "Wednesday · April 21", time: "2:30 PM", title: "Care after opening day", detail: "Consider operations, access, and long-term use.", track: "Roundtable" },
      ],
      tickets: [
        { id: "places-community", name: "Community pass", detail: "Full-day program and lunch break.", priceLabel: "Demo pass · no payment" },
        { id: "places-student", name: "Student pass", detail: "Full-day program for current students.", priceLabel: "Demo pass · no payment" },
      ],
    },
    {
      id: "local-tools-summit",
      title: "Local Tools Summit",
      summary: "A gathering for people building practical digital services with and for local communities.",
      date: "2027-05-26",
      category: "Community technology",
      format: "Hybrid",
      venue: "East Market Workshop",
      location: "Cleveland, Ohio",
      length: "One day",
      agenda: [
        { day: "Wednesday · May 26", time: "9:30 AM", title: "Start with the service", detail: "Trace the actual task before choosing a tool.", track: "Main room" },
        { day: "Wednesday · May 26", time: "12:15 PM", title: "Make the handoff clear", detail: "A service map exercise for teams across departments.", track: "Workshop" },
        { day: "Wednesday · May 26", time: "3:00 PM", title: "Build for the whole week", detail: "Design for interruptions, support, and return visits.", track: "Roundtable" },
      ],
      tickets: [
        { id: "tools-onsite", name: "On-site pass", detail: "Attend the complete program in person.", priceLabel: "Demo pass · no payment" },
        { id: "tools-online", name: "Online pass", detail: "Join the main sessions remotely.", priceLabel: "Demo pass · no payment" },
      ],
    },
    {
      id: "shared-cities",
      title: "Shared Cities Exchange",
      summary: "An open conversation about public information, civic trust, and shared decision-making.",
      date: "2027-06-16",
      category: "Civic design",
      format: "Virtual",
      venue: "Online session",
      location: "Join from anywhere",
      length: "Half day",
      agenda: [
        { day: "Wednesday · June 16", time: "10:00 AM", title: "Information in public", detail: "Make civic information easier to find and understand.", track: "Main room" },
        { day: "Wednesday · June 16", time: "1:00 PM", title: "Decisions people can see", detail: "Examples of clear, accountable service updates.", track: "Open session" },
      ],
      tickets: [
        { id: "cities-general", name: "Exchange pass", detail: "Join the full virtual program.", priceLabel: "Demo pass · no payment" },
      ],
    },
  ],
};
