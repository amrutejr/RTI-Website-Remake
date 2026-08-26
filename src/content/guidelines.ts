export type GuidelineCluster = {
  id: string;
  label: string;
  title: string;
  points: { n: number; text: string; sub?: string[] }[];
};

export const guidelineClusters: GuidelineCluster[] = [
  {
    id: "eligibility",
    label: "Eligibility",
    title: "Who may use this portal",
    points: [
      {
        n: 1,
        text: "This Web Portal can be used by Indian citizens to file an RTI application online and also to make payment for the RTI application online. A first appeal can also be filed online.",
      },
      {
        n: 2,
        text: "An applicant who desires to obtain any information under the RTI Act can make a request through this Web Portal to the Ministries or Departments of the Government of India.",
      },
      {
        n: 3,
        text: 'On clicking "Submit Request", the applicant has to fill the required details on the page that will appear.',
        sub: ["Fields marked with an asterisk are mandatory while the others are optional."],
      },
    ],
  },
  {
    id: "application",
    label: "Writing the application",
    title: "The text of your application",
    points: [
      { n: 4, text: "The text of the application may be written in the prescribed column." },
      {
        n: 5,
        text: "At present, the text of an application that can be uploaded at the prescribed column is confined to 3,000 characters only.",
        sub: [
          "Only alphabets A-Z a-z, numbers 0-9 and the special characters , . - _ ( ) / @ : & ? \\ % are allowed in the text of an RTI request application.",
        ],
      },
    ],
  },
  {
    id: "attachments",
    label: "Attachments",
    title: "Supporting documents",
    points: [
      {
        n: 6,
        text: 'In case an application contains more than 3,000 characters, it can be uploaded as an attachment using the "Supporting document" column.',
        sub: [
          "Do not upload an Aadhaar Card or PAN Card or any other personal identification, except a BPL Card.",
          "The PDF file name should not contain any blank spaces.",
        ],
      },
    ],
  },
  {
    id: "payment",
    label: "Payment of fee",
    title: "Paying the prescribed fee",
    points: [
      {
        n: 7,
        text: 'After filling the first page, the applicant has to click on "Make Payment" to pay the prescribed fee.',
      },
      {
        n: 8,
        text: "The applicant can pay the prescribed fee through the following modes:",
        sub: [
          "(a) Internet banking",
          "(b) Using a credit or debit card of Master/Visa",
          "(c) Using UPI",
          "(d) Using a RuPay Card",
        ],
      },
      { n: 9, text: "The fee for making an application is as prescribed in the RTI Rules, 2012." },
      { n: 10, text: "After making payment, an application can be submitted." },
      {
        n: 12,
        text: "No RTI fee is required to be paid by any citizen who is below the poverty line as per RTI Rules, 2012. However, such an applicant must attach a copy of the certificate issued by the appropriate government in this regard, along with the application.",
      },
    ],
  },
  {
    id: "registration",
    label: "Registration number",
    title: "Receipt and reconciliation",
    points: [
      {
        n: 11,
        text: "After making payment, if the applicant did not receive the registration number, the applicant is advised to wait for 24–48 working hours as the registration number will be generated after reconciliation. Please do not make an additional attempt to pay again. If it is not generated within 24–48 hours, kindly send an e-mail to helprtionline-dopt[at]nic[dot]in with the transaction details.",
      },
      {
        n: 13,
        text: "On submission of an application, a unique registration number would be issued, which may be referred to by the applicant for any future reference.",
      },
    ],
  },
  {
    id: "routing",
    label: "Routing & additional fee",
    title: "How your application travels",
    points: [
      {
        n: 14,
        text: 'The application filed through this Web Portal would reach electronically to the "Nodal Officer" of the concerned Ministry or Department, who would transmit the RTI application electronically to the concerned CPIO.',
      },
      {
        n: 15,
        text: "In case an additional fee is required representing the cost for providing information, the CPIO would intimate the applicant through this portal. This intimation can be seen through the Status Report or through an e-mail alert.",
      },
    ],
  },
  {
    id: "appeal",
    label: "First appeal",
    title: "Appealing a reply",
    points: [
      {
        n: 16,
        text: 'For making an appeal to the First Appellate Authority, the applicant has to click on "Submit First Appeal" and fill up the page that will appear.',
      },
      { n: 17, text: "The registration number of the original application has to be used for reference." },
      { n: 18, text: "As per the RTI Act, no fee has to be paid for a first appeal." },
    ],
  },
  {
    id: "alerts",
    label: "Alerts & status",
    title: "Staying informed",
    points: [
      {
        n: 19,
        text: "The applicant or appellant should submit his or her mobile number to receive SMS alerts.",
      },
      {
        n: 20,
        text: 'The status of the RTI application or first appeal filed online can be seen by the applicant or appellant by clicking on "View Status".',
      },
      {
        n: 21,
        text: "All the requirements for filing an RTI application and first appeal, as well as other provisions regarding time limits and exemptions, as provided in the RTI Act, 2005 will continue to apply.",
      },
    ],
  },
];
