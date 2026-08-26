import mockOtp from "@/assets/mock-otp.jpg";
import mockRequestForm from "@/assets/mock-request-form.jpg";
import mockPayment from "@/assets/mock-payment.jpg";
import mockRegistration from "@/assets/mock-registration.jpg";
import mockStatus from "@/assets/mock-status.jpg";

export type GuideStep = {
  n: string;
  title: string;
  body: string;
  fields?: { label: string; hint: string }[];
  note?: string;
  image?: { src: string; alt: string; width: number; height: number };
};

export const guideSteps: GuideStep[] = [
  {
    n: "00",
    title: "Prepare before you open the form",
    body: "Work through the preparation checklist first: identify the right public authority, break your problem into the records that already exist, frame each request as a demand for a document rather than an explanation, and fix the period. The checklist assembles the application for you and carries it into the form.",
    fields: [
      { label: "Applicant and authority", hint: "Name, address, Central or State, public authority, CPIO if known" },
      { label: "The issue", hint: "Reference number, dates, office and officials concerned" },
      { label: "Records to request", hint: "File notings, orders, correspondence, bills, inspection reports and more" },
      { label: "Period and format", hint: "A bounded date range and electronic or certified copies" },
    ],
    note: "Ask for existing records, documents, data or files. A PIO is not obliged to give opinions, explanations or interpretations, or to create new information.",
  },
  {
    n: "01",
    title: "Read the guidelines and accept them",
    body: 'Every filing starts on the guidelines screen. Read all 21 points, tick "I have read and understood the above guidelines" and submit to reach the request form.',
    note: "The same screen serves both an RTI request and a first appeal — the acknowledgement is mandatory in both cases.",
  },
  {
    n: "02",
    title: "Verify your email and mobile",
    body: "Enter the email ID where the OTP should arrive, optionally your mobile number for SMS alerts, and the security code shown on screen. An OTP is then sent to you.",
    fields: [
      { label: "Email ID", hint: "Mandatory — receives the OTP, registration number and every alert" },
      { label: "Mobile number", hint: "Optional — required only if you want SMS alerts" },
      { label: "Security code", hint: "Mandatory — characters are case insensitive, refresh if unreadable" },
    ],
    note: "OTPs do not expire until they are used, so you can register your application as soon as the OTP arrives.",
    image: { src: mockOtp, alt: "Email and OTP verification screen with security code", width: 1408, height: 912 },
  },
  {
    n: "03",
    title: "Fill the Online RTI Request Form",
    body: "Choose the public authority and describe the information you are seeking. Fields marked as mandatory must be completed before you can proceed to payment.",
    fields: [
      { label: "Ministry / Department", hint: "Only Central public authorities are listed" },
      { label: "Applicant name, address, state, pincode", hint: "Used for dispatch of the reply" },
      { label: "Citizenship", hint: "Indian citizenship is required to file under the Act" },
      { label: "Education status, phone number", hint: "Optional details" },
      { label: "Is the applicant below poverty line?", hint: "If yes, attach the BPL certificate — no fee is payable" },
      { label: "Text of application", hint: "Up to 3,000 characters; limited special characters allowed" },
    ],
    image: {
      src: mockRequestForm,
      alt: "Online RTI Request Form with ministry selector, applicant fields and application text",
      width: 1408,
      height: 1008,
    },
  },
  {
    n: "04",
    title: "Attach a supporting document if needed",
    body: 'Where the application runs beyond 3,000 characters, upload the full text as a PDF in the "Supporting document" column.',
    fields: [
      { label: "Supporting document", hint: "PDF only" },
      { label: "BPL certificate", hint: "Required when claiming fee exemption" },
    ],
    note: "Never upload an Aadhaar Card, PAN Card or other personal identification (a BPL card is the only exception). The PDF file name must not contain blank spaces.",
  },
  {
    n: "05",
    title: "Make the payment",
    body: 'Non-BPL applicants click "Make Payment" and pay the ₹10 prescribed fee. The application can be submitted only after the payment goes through.',
    fields: [
      { label: "Internet banking", hint: "SBI payment gateway and associated banks" },
      { label: "Debit / credit card", hint: "Master, Visa, or SBI ATM-cum-debit card" },
      { label: "UPI", hint: "Any UPI application" },
      { label: "RuPay card", hint: "Accepted on the same gateway" },
    ],
    image: {
      src: mockPayment,
      alt: "Payment screen with the ten rupee fee and UPI, net banking, card and RuPay options",
      width: 1408,
      height: 912,
    },
  },
  {
    n: "06",
    title: "Keep your registration number",
    body: "On submission, a unique registration number is issued. It is your receipt and the key to every later action — status checks, additional fee payments and the first appeal.",
    note: "If the number does not arrive, wait 24–48 working hours before doing anything: it is generated after reconciliation. Do not pay again.",
    image: {
      src: mockRegistration,
      alt: "Confirmation screen displaying the RTI request registration number",
      width: 1264,
      height: 848,
    },
  },
  {
    n: "07",
    title: "Track the reply in View Status",
    body: "Enter the registration number and email ID to see where your request stands — transferred to the CPIO, an additional fee intimation, a document request, or the final reply.",
    note: "The CPIO normally replies within 30 days of registration, or within 48 hours where the information concerns the life or liberty of a person.",
    image: {
      src: mockStatus,
      alt: "View Status screen showing a request timeline from registration to reply",
      width: 1408,
      height: 912,
    },
  },
  {
    n: "08",
    title: "File a first appeal, or reconcile a payment",
    body: 'If no reply arrives within 30 days or the reply is unsatisfactory, use "Submit First Appeal" with the original registration number and email ID — no fee is payable. If money left your account but no registration number was issued, use "Payment Reconciliation" with the same email and mobile number.',
    note: "An online first appeal can only be filed against an RTI application that was itself filed online.",
  },
];
