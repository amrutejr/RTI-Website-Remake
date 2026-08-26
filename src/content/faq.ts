export type FaqItem = { q: string; a: string[] };
export type FaqGroup = { id: string; label: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "filing",
    label: "Filing a request",
    items: [
      {
        q: "To which Public Authority can I file a request through this portal?",
        a: [
          "An applicant who desires to obtain information under the RTI Act, 2005 can make a request through this RTI Online Portal to the Central Ministries/Departments and other Central Public Authorities mentioned in the online RTI request form.",
        ],
      },
      {
        q: "How do I write my application for seeking the information as per RTI Act 2005?",
        a: [
          "The text of the application may be written in the prescribed column of the RTI request form. At present, the text of the application is confined up to 3,000 characters only.",
          'In case the text of an application contains more than 3,000 characters, it can be uploaded as a PDF attachment in the "Supporting Document" column of the form.',
        ],
      },
      {
        q: "Is it mandatory to create a user account on the RTI Online web portal?",
        a: ['No. You can directly file your RTI on the "Submit Request" tab.'],
      },
      {
        q: "Can I file an RTI application for state public authorities through this portal?",
        a: ["No. This portal is exclusively meant for Public Authorities under the Central Government only."],
      },
      {
        q: "What will happen to my application if I select a wrong Public Authority in the RTI request form?",
        a: [
          'In case the RTI application is not meant for the Public Authority selected by the applicant, the "Nodal Officer" of that public authority would transfer the application electronically to the "Nodal Officer" of the concerned Central Public Authority if it is aligned to this portal, and physically to a Central Public Authority which is not aligned to this portal, under section 6(3) of the RTI Act.',
          "RTI applications filed through this portal for state public authorities, including NCT of Delhi, would be returned without any refund of fee.",
        ],
      },
      {
        q: 'How to upload a supporting document if an alert comes as "SUPPORTING DOCUMENTS REQUIRED FROM APPLICANT"?',
        a: [
          "When a Public Authority requests a supporting document, an alert is sent to the applicant's mobile or email ID. In such a situation the applicant should visit the RTI Online website and enter the details in 'View Status'. Once the details are entered, the current status of the RTI application is shown along with the option for uploading the supporting document.",
        ],
      },
    ],
  },
  {
    id: "fees",
    label: "Fees and payment",
    items: [
      {
        q: "How do I make the payment for RTI fee?",
        a: [
          'After filling the first page of the RTI request form, a non-BPL applicant has to click on the "Make Payment" button for payment of the prescribed RTI fee.',
          "The applicant can pay the prescribed RTI fee through internet banking through the SBI payment gateway and its associated banks, an ATM-cum-Debit card of the State Bank of India, a credit or debit card of Master/Visa, or UPI.",
          "No RTI fee is required to be paid by a citizen who is below the poverty line, as per RTI Rules, 2012. However, the BPL applicant must attach a copy of the certificate issued by the appropriate government in this regard, along with the application.",
        ],
      },
      {
        q: "Will I be informed if an additional fee is required to be paid?",
        a: [
          'In case an additional fee representing the cost is required for providing information, the CPIO will intimate the same, which can be viewed by the applicant through the "View Status" option, and an e-mail alert or SMS or both will also be sent.',
          "For payment of the additional fee online, use the 'View Status' option and on providing the registration number of the request, the option for \"Make Payment\" will be available.",
        ],
      },
      {
        q: "Do I need to make any payment for filing an appeal?",
        a: ["As per the RTI Act, no fee has to be paid for a first appeal."],
      },
      {
        q: "What should I do if the amount is deducted from my account but the registration number is not generated?",
        a: [
          'Use the "Payment Reconciliation" feature.',
          "Please do not attempt to make payment repeatedly or try to submit the request once again. Kindly wait 24 to 48 working hours, as the registration number will be generated after reconciliation. If it is not generated within that time frame, send an e-mail to helprtionline-dopt[at]nic[dot]in with your transaction details.",
          'In cases of unsuccessful RTI payment requests, if the requester wishes to check the payment status before 48 hours, it can be verified using the "Payment Reconciliation" feature.',
        ],
      },
      {
        q: "What if the registration number is not received on my email or mobile even after 48 working hours?",
        a: [
          "Registration numbers are generated after reconciliation of bank scrolls for cases whose numbers are not generated instantly after the payment. This procedure may take 24 to 48 working hours. If the registration number is still not received, the applicant may contact their respective bank for a refund of the amount.",
        ],
      },
    ],
  },
  {
    id: "status",
    label: "Status and replies",
    items: [
      {
        q: "Do I get any receipt for online filing of an RTI application?",
        a: [
          "On submission of an application, a unique registration number will be issued, which may be referred to by the applicant for any future reference.",
          'The application filed through this portal will reach electronically to the "Nodal Officer" of the said Ministry/Department and not to the CPIO of the concerned Ministry/Department. The Nodal Officer will transmit the RTI application electronically to the concerned CPIO.',
        ],
      },
      {
        q: "How can I view the status or reply of my RTI application or first appeal?",
        a: [
          'The status or reply of an RTI application or first appeal filed online can be viewed by clicking on "View Status".',
        ],
      },
      {
        q: "Do I get any SMS from the RTI Online Portal?",
        a: [
          "Though optional, a mobile number can be provided by the applicant or appellant in order to receive SMS alerts.",
        ],
      },
      {
        q: "Why have I received multiple RTI registration numbers even though I filed a single RTI application?",
        a: [
          "This is the case where your RTI application has been forwarded to multiple CPIOs, since the information sought lies with more than one PIO.",
        ],
      },
    ],
  },
  {
    id: "appeals",
    label: "Appeals",
    items: [
      {
        q: "How do I file an appeal with the First Appellate Authority?",
        a: [
          'For making an appeal to the First Appellate Authority, select the option "Submit First Appeal" in the RTI Online Portal and fill up the form that will appear.',
          "The registration number and e-mail ID of the original application are required for filing the first appeal.",
        ],
      },
      {
        q: "What should I do when the portal is not allowing me to file the first appeal?",
        a: [
          "This may happen in two situations.",
          "1) When your RTI application has been physically transferred to another public authority which is not aligned to this portal. In such a case you are required to file your appeal in physical mode to the concerned public authority.",
          "2) When your RTI application has not been replied to by the CPIO and the 30-day period has not lapsed. In such a case you may file the first appeal only after completion of the stipulated period of 30 days.",
        ],
      },
      {
        q: "Can I file an online first appeal for an RTI application filed physically?",
        a: ["No. An online first appeal can only be filed against a previously filed online RTI application."],
      },
      {
        q: "If the RTI application is filed manually, is it possible to file the first appeal online?",
        a: [
          "Manual applications can be lodged into the RTI Online portal by CPIOs and can be disposed of by the CPIO online.",
          "If the applicant provides an email ID or mobile number in the application form and the CPIO lodges the application in the portal, the actions taken by the CPIO will be conveyed to the applicant automatically through e-mail and SMS. The applicant can then file the first appeal with the help of the registration number conveyed.",
        ],
      },
    ],
  },
  {
    id: "account",
    label: "Account and history",
    items: [
      {
        q: "What can I do if I forgot my login credentials?",
        a: ["You can go to the View History column to see your past RTI requests and appeals."],
      },
      {
        q: "How long is an RTI request or appeal retained on this portal?",
        a: [
          "In View History and View Status, a citizen can see RTI cases retained for a period of 3 years.",
        ],
      },
      {
        q: "Why is the RTI application filed by me not reflecting in my user account history?",
        a: [
          'If you opted to file the RTI or first appeal directly, that is without logging into your user account, you will not be able to see it in your registered account history. However, you can always check its status in "View Status" with the provided registration number.',
        ],
      },
    ],
  },
  {
    id: "technical",
    label: "Technical and helpdesk",
    items: [
      {
        q: "What queries can be raised with the helpline email helprtionline-dopt[at]nic[dot]in?",
        a: [
          "The helpline mail ID is exclusively meant for queries or problems faced while filing an online RTI through this portal. Please do not send mail to this helpline for any other matter or for asking for any other details. The reply is limited to the RTI Online portal of the Central Government only.",
        ],
      },
      {
        q: "What should I do when my browser shows a certificate error while opening the RTI Online portal?",
        a: [
          "You should proceed forward past the certificate error. In Mozilla Firefox select 'I understand the risk, add exception'; in Google Chrome select 'Proceed anyway'; in Internet Explorer select 'Continue to this website'.",
        ],
      },
    ],
  },
];

export const faqCount = faqGroups.reduce((n, g) => n + g.items.length, 0);
