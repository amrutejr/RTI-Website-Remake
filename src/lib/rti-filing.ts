export type FilingKind = "request" | "appeal";

export interface FilingDraft {
  email: string;
  mobile: string;
  emailVerified: boolean;
  mobileVerified: boolean;
  ministry: string;
  publicAuthority: string;
  name: string;
  gender: string;
  address: string;
  state: string;
  pincode: string;
  country: string;
  educationRural: string;
  phone: string;
  citizen: string;
  bpl: boolean;
  bplProof: string;
  subject: string;
  text: string;
  attachment: string;
  paymentMode: string;
  kind: FilingKind;
}

export const emptyDraft: FilingDraft = {
  email: "",
  mobile: "",
  emailVerified: false,
  mobileVerified: false,
  ministry: "",
  publicAuthority: "",
  name: "",
  gender: "Male",
  address: "",
  state: "",
  pincode: "",
  country: "India",
  educationRural: "Urban",
  phone: "",
  citizen: "Indian",
  bpl: false,
  bplProof: "",
  subject: "",
  text: "",
  attachment: "",
  paymentMode: "upi",
  kind: "request",
};

export const ministries = [
  "Ministry of Home Affairs",
  "Ministry of Finance — Department of Revenue",
  "Ministry of Railways (Railway Board)",
  "Ministry of Education — Department of Higher Education",
  "Ministry of Health and Family Welfare",
  "Ministry of Personnel, Public Grievances and Pensions",
  "Ministry of Road Transport and Highways",
  "Ministry of Petroleum and Natural Gas",
];

export const authoritiesByMinistry: Record<string, string[]> = {
  "Ministry of Home Affairs": [
    "Central Public Information Officer, Foreigners Division",
    "Central Public Information Officer, Police Modernisation Division",
    "Central Public Information Officer, Freedom Fighters Division",
  ],
  "Ministry of Finance — Department of Revenue": [
    "CPIO, Central Board of Direct Taxes",
    "CPIO, Central Board of Indirect Taxes and Customs",
  ],
  "Ministry of Railways (Railway Board)": [
    "CPIO, Northern Railway",
    "CPIO, Western Railway",
    "CPIO, Railway Recruitment Board",
  ],
};

export const indianStates = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

export const paymentModes = [
  { id: "upi", label: "UPI", hint: "Any UPI app · instant" },
  { id: "netbanking", label: "Internet banking", hint: "SBI and associate banks" },
  { id: "card", label: "Debit / credit card", hint: "Visa, RuPay, Mastercard" },
] as const;

export type TrackingStage =
  | "submitted"
  | "with-nodal"
  | "with-cpio"
  | "replied"
  | "appeal";

export interface TrackingEvent {
  stage: TrackingStage;
  label: string;
  detail: string;
  date: string;
  done: boolean;
}

export interface FiledRti {
  registrationNumber: string;
  email: string;
  ministry: string;
  publicAuthority: string;
  subject: string;
  filedOn: string;
  dueOn: string;
  kind: FilingKind;
  events: TrackingEvent[];
}

const STORAGE_KEY = "rti-online:filings";

function fmt(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function makeRegistrationNumber() {
  const year = new Date().getFullYear();
  const seq = Math.floor(100000 + Math.random() * 899999);
  return `DOPTG/R/${year}/${seq}`;
}

export function buildFiling(draft: FilingDraft, registrationNumber: string): FiledRti {
  const now = new Date();
  const due = new Date(now.getTime() + 30 * 86400000);
  return {
    registrationNumber,
    email: draft.email,
    ministry: draft.ministry,
    publicAuthority: draft.publicAuthority,
    subject: draft.subject || draft.text.slice(0, 60),
    filedOn: fmt(now),
    dueOn: fmt(due),
    kind: draft.kind,
    events: [
      {
        stage: "submitted",
        label: "Application submitted",
        detail: "Fee of ₹10 received. Registration number generated.",
        date: fmt(now),
        done: true,
      },
      {
        stage: "with-nodal",
        label: "Received by Nodal Officer",
        detail: "Routed to the Nodal Officer of the selected public authority.",
        date: fmt(new Date(now.getTime() + 86400000)),
        done: false,
      },
      {
        stage: "with-cpio",
        label: "Assigned to CPIO",
        detail: "The CPIO concerned is preparing the reply.",
        date: "Awaiting",
        done: false,
      },
      {
        stage: "replied",
        label: "Reply issued",
        detail: `Due on or before ${fmt(due)} (30 days).`,
        date: "Awaiting",
        done: false,
      },
    ],
  };
}

export const demoFilings: FiledRti[] = [
  {
    registrationNumber: "DOPTG/R/2026/601234",
    email: "demo@rtionline.gov.in",
    ministry: "Ministry of Railways (Railway Board)",
    publicAuthority: "CPIO, Northern Railway",
    subject: "Tender documents for platform redevelopment at New Delhi station",
    filedOn: "2026-07-28",
    dueOn: "2026-08-27",
    kind: "request",
    events: [
      {
        stage: "submitted",
        label: "Application submitted",
        detail: "Fee of ₹10 received. Registration number generated.",
        date: "2026-07-28",
        done: true,
      },
      {
        stage: "with-nodal",
        label: "Received by Nodal Officer",
        detail: "Routed to the Nodal Officer, Railway Board.",
        date: "2026-07-29",
        done: true,
      },
      {
        stage: "with-cpio",
        label: "Assigned to CPIO",
        detail: "CPIO, Northern Railway is preparing the reply.",
        date: "2026-08-02",
        done: true,
      },
      {
        stage: "replied",
        label: "Reply issued",
        detail: "Reply and 4 annexures available for download.",
        date: "2026-08-19",
        done: true,
      },
    ],
  },
  {
    registrationNumber: "DOPTG/A/2026/700891",
    email: "demo@rtionline.gov.in",
    ministry: "Ministry of Home Affairs",
    publicAuthority: "Central Public Information Officer, Foreigners Division",
    subject: "First appeal against incomplete reply on visa processing timelines",
    filedOn: "2026-08-11",
    dueOn: "2026-09-10",
    kind: "appeal",
    events: [
      {
        stage: "submitted",
        label: "Appeal submitted",
        detail: "No fee payable for a first appeal.",
        date: "2026-08-11",
        done: true,
      },
      {
        stage: "with-nodal",
        label: "Received by Nodal Officer",
        detail: "Forwarded to the First Appellate Authority.",
        date: "2026-08-12",
        done: true,
      },
      {
        stage: "with-cpio",
        label: "Under consideration",
        detail: "The First Appellate Authority is examining the appeal.",
        date: "2026-08-18",
        done: true,
      },
      {
        stage: "replied",
        label: "Appellate order",
        detail: "Due on or before 2026-09-10 (30 days).",
        date: "Awaiting",
        done: false,
      },
    ],
  },
];

export function loadFilings(): FiledRti[] {
  if (typeof window === "undefined") return demoFilings;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const saved = raw ? (JSON.parse(raw) as FiledRti[]) : [];
    return [...saved, ...demoFilings];
  } catch {
    return demoFilings;
  }
}

export function saveFiling(filing: FiledRti) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const saved = raw ? (JSON.parse(raw) as FiledRti[]) : [];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([filing, ...saved].slice(0, 20)));
  } catch {
    /* ignore */
  }
}
