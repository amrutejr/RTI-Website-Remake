export type RecordType = { id: string; label: string; line: string };

/** Section 3 — records worth asking for, and the request line each one produces. */
export const recordTypes: RecordType[] = [
  { id: "notings", label: "File notings", line: "Copies of all file notings relating to the matter described above." },
  { id: "orders", label: "Government orders", line: "Copies of all Government orders issued in respect of the matter described above." },
  { id: "circulars", label: "Circulars", line: "Copies of all circulars applicable to the matter described above." },
  { id: "notifications", label: "Notifications", line: "Copies of all notifications issued in respect of the matter described above." },
  { id: "sanction", label: "Sanction orders", line: "Copies of all sanction orders issued in the matter described above." },
  { id: "tender", label: "Tender documents", line: "Copies of the tender documents, including the notice inviting tender and the evaluation record." },
  { id: "workorders", label: "Work orders", line: "Copies of all work orders issued in the matter described above." },
  { id: "contracts", label: "Contracts / agreements", line: "Copies of the contracts or agreements executed in the matter described above." },
  { id: "bills", label: "Bills and invoices", line: "Copies of the bills and invoices received and passed for payment in the matter described above." },
  { id: "expenditure", label: "Expenditure statements", line: "Copies of the expenditure statements maintained for the matter described above." },
  { id: "inspection", label: "Inspection reports", line: "Copies of all inspection reports recorded in the matter described above." },
  { id: "minutes", label: "Meeting minutes", line: "Copies of the minutes of all meetings held in the matter described above." },
  { id: "correspondence", label: "Correspondence", line: "Copies of all correspondence, including letters and e-mails, exchanged in the matter described above." },
  { id: "status", label: "Status reports", line: "Copies of the latest status report available on record in the matter described above." },
  { id: "beneficiary", label: "Beneficiary lists", line: "A copy of the beneficiary list maintained in the matter described above." },
  { id: "decisions", label: "Recorded decisions", line: "Copies of the decisions recorded, along with the reasons recorded for them." },
  { id: "rules", label: "Applicable rules / SOPs", line: "A copy of the rules, regulations or Standard Operating Procedure governing the matter described above." },
  { id: "atr", label: "Action-taken reports", line: "Copies of the action-taken reports prepared in the matter described above." },
  { id: "receipt", label: "Receipt / diary entry", line: "The date on which the application or complaint referred to above was received, with a copy of the diary or receipt entry." },
];

/** Section 4 — framing. */
export const weakExample = "Why has my application not been processed?";

export const betterQuestions: string[] = [
  "Provide the current status of my application.",
  "Provide the date on which my application was received.",
  "Provide copies of all file notings relating to my application.",
  "Provide copies of correspondence regarding my application.",
  "Provide the name and designation of the officer currently responsible for processing it.",
  "Provide the applicable rules or SOP governing the processing timeline.",
  "If my application was rejected, provide a copy of the recorded reasons for rejection.",
];

/** Words that signal you are asking for an opinion rather than a record. */
export const weakPhrases = [
  "why",
  "explain",
  "opinion",
  "justify",
  "reason for not",
  "clarify",
  "kindly tell",
  "who is responsible for the delay",
  "what do you think",
  "is it fair",
];

export const rewriteHints: { match: string; hint: string }[] = [
  { match: "why", hint: 'Replace "why" with a request for the recorded reasons, file notings or correspondence.' },
  { match: "explain", hint: 'Instead of an explanation, ask for the record that contains it — notings, orders or the applicable rules.' },
  { match: "opinion", hint: "A PIO cannot supply opinions. Ask for the document in which a decision is recorded." },
  { match: "justify", hint: "Ask for the reasons recorded on file rather than a justification." },
  { match: "clarify", hint: "Ask for the rule, circular or SOP that governs the point instead of a clarification." },
];

/** Section 6 — useful supporting documents. */
export const supportingDocs = [
  { id: "prev-application", label: "Previous application" },
  { id: "reference", label: "Complaint / reference number" },
  { id: "prev-correspondence", label: "Previous correspondence" },
  { id: "go", label: "Government order or notification" },
  { id: "prev-rti", label: "Previous RTI response" },
  { id: "receipts", label: "Relevant receipts" },
  { id: "bpl", label: "BPL proof (if claiming exemption)" },
];

/** Section 7 — preferred response format. */
export const formatOptions = [
  { id: "pdf", label: "PDF / electronic copies", line: "electronic or PDF copies by e-mail wherever available" },
  { id: "certified", label: "Certified copies where required", line: "certified copies where certification is required" },
  { id: "data", label: "Data in electronic format", line: "data in electronic format where it already exists in that form" },
  { id: "post", label: "Hard copies by post", line: "hard copies by post" },
];
