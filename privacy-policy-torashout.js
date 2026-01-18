const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  LevelFormat,
} = require("docx");
const fs = require("fs");

// Brand colors (hex without #)
const PURPLE = "7C3AED";
const PINK = "EC4899";

// Current date
const effectiveDate = "17 January 2026";
const lastUpdated = "17 January 2026";

// Create the document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 24 }, // 12pt
      },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: PURPLE },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "333333" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "444444" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: "○",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "numbers",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 }, // US Letter
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "TORA", bold: true, color: PURPLE, size: 28 }),
                new TextRun({ text: "SHAOUT", bold: true, color: PINK, size: 28 }),
                new TextRun({ text: " | Privacy Policy", color: "666666", size: 22 }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "© 2026 ToraShaout (Pvt) Ltd. | A StatoTech Company", size: 18, color: "888888" }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Page ", size: 18, color: "888888" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" }),
                new TextRun({ text: " of ", size: 18, color: "888888" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "888888" }),
              ],
            }),
          ],
        }),
      },
      children: [
        // Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "TORA", bold: true, size: 56, color: PURPLE }),
            new TextRun({ text: "SHAOUT", bold: true, size: 56, color: PINK }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({ text: "PRIVACY POLICY", bold: true, size: 40, color: "333333" }),
          ],
        }),

        // Effective Date Box
        createInfoBox("Effective Date", effectiveDate, "Last Updated", lastUpdated),

        new Paragraph({ spacing: { after: 200 }, children: [] }),

        // Regulatory Compliance Notice
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("Regulatory Compliance Notice")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("This Privacy Policy is drafted in compliance with the "),
            new TextRun({ text: "Cyber and Data Protection Act [Chapter 12:07]", bold: true }),
            new TextRun(" of Zimbabwe, the "),
            new TextRun({ text: "Statutory Instrument 155 of 2024", bold: true }),
            new TextRun(" (Cyber and Data Protection (Licensing of Data Controllers and Appointment of Data Protection Officers) Regulations), and the "),
            new TextRun({ text: "Constitution of Zimbabwe, Article 57", bold: true }),
            new TextRun(" (Right to Privacy). ToraShaout (Pvt) Ltd is registered as a Data Controller with the Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ)."),
          ],
        }),

        // 1. Introduction
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("1. Introduction and Scope")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("Welcome to ToraShaout. We are a celebrity video marketplace platform that connects fans with their favourite celebrities through personalised video content. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our platform, mobile applications, and related services."),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("ToraShaout (Pvt) Ltd ("),
            new TextRun({ text: "\"ToraShaout\", \"we\", \"us\", \"our\"", bold: true }),
            new TextRun("), a subsidiary of StatoTech, is the Data Controller responsible for your personal information. We are committed to protecting your privacy and ensuring that your personal data is processed in accordance with Zimbabwean law and international best practices."),
          ],
        }),

        // 2. Data Controller Information
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("2. Data Controller Information")],
        }),
        createContactTable(),
        new Paragraph({ spacing: { after: 200 }, children: [] }),

        // 3. Definitions
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("3. Key Definitions")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun("As defined under the Cyber and Data Protection Act [Chapter 12:07]:"),
          ],
        }),
        ...createDefinitionsList(),

        // 4. Personal Information We Collect
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("4. Personal Information We Collect")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("In accordance with the principle of "),
            new TextRun({ text: "data minimisation", bold: true }),
            new TextRun(", we only collect personal information that is adequate, relevant, and necessary for our stated purposes."),
          ],
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("4.1 Information You Provide Directly")],
        }),
        ...createBulletList([
          "Account Registration: Full name, email address, phone number, date of birth, username, password (encrypted), profile photograph",
          "Identity Verification (for Celebrities): National ID number, passport details, proof of address, bank account or mobile money details for payments",
          "Payment Information: Mobile money details (EcoCash, OneMoney), bank account information, transaction history",
          "Communications: Messages, video requests, customer support inquiries, feedback",
          "Content: Videos uploaded by celebrities, user reviews, comments",
        ]),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("4.2 Information Collected Automatically")],
        }),
        ...createBulletList([
          "Device Information: IP address, device type, operating system, browser type, unique device identifiers",
          "Usage Data: Pages visited, features used, time spent, click patterns, search queries",
          "Location Data: General location derived from IP address (we do not collect precise GPS location without explicit consent)",
          "Cookies and Similar Technologies: Session cookies, preference cookies, analytics cookies",
        ]),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("4.3 Sensitive Personal Information")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun("We may process the following categories of sensitive personal information with your explicit consent:"),
          ],
        }),
        ...createBulletList([
          "Biometric Data: Facial recognition data for celebrity verification (processed with explicit consent only)",
          "Financial Information: Payment details necessary for transactions",
        ]),

        // 5. Legal Basis for Processing
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("5. Legal Basis for Processing")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("Under the Cyber and Data Protection Act, we process your personal information based on the following lawful grounds:"),
          ],
        }),
        createLegalBasisTable(),
        new Paragraph({ spacing: { after: 200 }, children: [] }),

        // 6. How We Use Your Information
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("6. Purpose of Processing")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun("In compliance with the principle of "),
            new TextRun({ text: "purpose limitation", bold: true }),
            new TextRun(", we collect personal information for specific, explicit, and legitimate purposes and do not process it in a manner incompatible with those purposes:"),
          ],
        }),
        ...createBulletList([
          "To create and manage your account and verify your identity",
          "To facilitate transactions between fans and celebrities",
          "To process payments and prevent fraud",
          "To provide customer support and respond to inquiries",
          "To send service-related notifications and updates",
          "To improve our platform, develop new features, and conduct analytics",
          "To ensure platform security and prevent misuse",
          "To comply with legal obligations and respond to lawful requests",
          "To enforce our Terms of Service and protect our rights",
          "To send marketing communications (only with your explicit consent)",
        ]),

        // 7. Data Subject Rights
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("7. Your Rights Under Zimbabwean Law")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("Under "),
            new TextRun({ text: "Section 14 of the Cyber and Data Protection Act", bold: true }),
            new TextRun(", you have the following rights regarding your personal information:"),
          ],
        }),
        createRightsTable(),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("To exercise any of these rights, please contact our Data Protection Officer using the details provided in Section 2. We will respond to your request within "),
            new TextRun({ text: "30 days", bold: true }),
            new TextRun(" of receipt. There is no fee for exercising your rights, except where requests are manifestly unfounded or excessive."),
          ],
        }),

        // 8. Children's Privacy
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("8. Protection of Children's Data")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("ToraShaout takes the protection of children's personal information seriously, in compliance with the special provisions for children under the Cyber and Data Protection Act:"),
          ],
        }),
        ...createBulletList([
          "Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.",
          "Users between 13 and 18 years of age require verifiable parental or guardian consent before creating an account.",
          "We conduct regular Data Protection Impact Assessments (DPIAs) for any processing involving children's data, as required by SI 155 of 2024.",
          "Parents or guardians may contact us to review, delete, or stop the collection of their child's personal information.",
          "If we become aware that we have collected personal information from a child without appropriate consent, we will take immediate steps to delete that information.",
        ]),

        // 9. Data Sharing and Disclosure
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("9. Disclosure of Personal Information")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("We may share your personal information with the following categories of recipients:"),
          ],
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("9.1 Service Providers")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("Third-party service providers who assist us in operating our platform, including payment processors, cloud hosting providers, analytics services, and customer support tools. All service providers are contractually bound to protect your data and process it only on our instructions."),
          ],
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("9.2 Legal Requirements")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("We may disclose personal information when required by law, court order, or government request, including to POTRAZ and other regulatory authorities."),
          ],
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("9.3 Business Transfers")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("In the event of a merger, acquisition, or sale of assets, your personal information may be transferred. We will notify you of any such change and your choices regarding your information."),
          ],
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("9.4 With Your Consent")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("We may share your information with third parties when you have given explicit consent to do so."),
          ],
        }),

        // 10. International Data Transfers
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("10. Cross-Border Data Transfers")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("In accordance with "),
            new TextRun({ text: "Sections 28-29 of the Cyber and Data Protection Act", bold: true }),
            new TextRun(", we ensure adequate protection when transferring personal information outside Zimbabwe:"),
          ],
        }),
        ...createBulletList([
          "We will notify POTRAZ before any cross-border transfer of personal information.",
          "Transfers will only occur to countries or organisations that provide an adequate level of data protection as determined by POTRAZ.",
          "Where adequate protection is not assured, we will implement appropriate safeguards such as Standard Contractual Clauses or obtain your explicit consent.",
          "Our primary data processing occurs within Zimbabwe. Where international cloud services are used, we ensure contractual protections are in place.",
        ]),

        // 11. Data Security
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("11. Data Security Measures")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, destruction, or alteration:"),
          ],
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("11.1 Technical Measures")],
        }),
        ...createBulletList([
          "Encryption of data in transit (TLS 1.3) and at rest (AES-256)",
          "Secure password hashing using industry-standard algorithms",
          "Regular security assessments and penetration testing",
          "Firewalls, intrusion detection systems, and access controls",
          "Secure development practices and code reviews",
        ]),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("11.2 Organisational Measures")],
        }),
        ...createBulletList([
          "Staff training on data protection and security",
          "Access controls based on the principle of least privilege",
          "Regular risk assessments as required by SI 155",
          "Documented security policies and procedures",
          "Incident response and business continuity plans",
        ]),

        // 12. Data Breach Notification
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("12. Data Breach Notification")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("In the event of a personal data breach, we will comply with the notification requirements under SI 155 of 2024:"),
          ],
        }),
        createBreachTable(),
        new Paragraph({ spacing: { after: 200 }, children: [] }),

        // 13. Automated Decision Making
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("13. Automated Decision-Making")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("Where we use automated processing to make decisions that significantly affect your rights, we will:"),
          ],
        }),
        ...createBulletList([
          "Obtain your explicit consent before such processing, as required by the Act.",
          "Inform you of the logic involved and the significance of such processing.",
          "Provide you with the right to request human intervention and to challenge the decision.",
          "Conduct regular reviews of automated systems to ensure fairness and accuracy.",
        ]),

        // 14. Data Retention
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("14. Data Retention")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, in accordance with the principle of "),
            new TextRun({ text: "storage limitation", bold: true }),
            new TextRun(":"),
          ],
        }),
        createRetentionTable(),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("After the retention period expires, we will securely delete or anonymise your personal information unless retention is required by law."),
          ],
        }),

        // 15. Cookies
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("15. Cookies and Tracking Technologies")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("We use cookies and similar technologies to enhance your experience. For detailed information, please refer to our separate Cookie Policy. You may manage your cookie preferences through your browser settings or our cookie consent tool."),
          ],
        }),

        // 16. Direct Marketing
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("16. Direct Marketing")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("We will only send you marketing communications with your explicit opt-in consent. You have the right to object to direct marketing at any time by:"),
          ],
        }),
        ...createBulletList([
          "Clicking the 'unsubscribe' link in any marketing email",
          "Updating your preferences in your account settings",
          "Contacting our Data Protection Officer",
        ]),

        // 17. Third-Party Links
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("17. Third-Party Links and Services")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal information."),
          ],
        }),

        // 18. Updates to Policy
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("18. Changes to This Privacy Policy")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by:"),
          ],
        }),
        ...createBulletList([
          "Posting the updated policy on our platform with a new 'Last Updated' date",
          "Sending you an email notification if the changes are significant",
          "Displaying a prominent notice on our platform",
        ]),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("Your continued use of our platform after such changes constitutes acceptance of the updated policy."),
          ],
        }),

        // 19. Complaints
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("19. Complaints and Regulatory Authority")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("If you believe your data protection rights have been violated, you have the right to lodge a complaint with:"),
          ],
        }),
        createPOTRAZTable(),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("We encourage you to contact us first so we can try to resolve your concerns directly."),
          ],
        }),

        // 20. Contact Us
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("20. Contact Us")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:"),
          ],
        }),
        createFinalContactTable(),
        new Paragraph({ spacing: { after: 400 }, children: [] }),

        // Acknowledgment
        new Paragraph({
          alignment: AlignmentType.CENTER,
          shading: { fill: "F3E8FF", type: ShadingType.CLEAR },
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({ text: "By using ToraShaout, you acknowledge that you have read, understood, and agree to this Privacy Policy.", italics: true, size: 22 }),
          ],
        }),

        // Version info
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 300 },
          children: [
            new TextRun({ text: "Document Version: 1.0 | Effective: " + effectiveDate, size: 20, color: "888888" }),
          ],
        }),
      ],
    },
  ],
});

// Helper function: Info Box
function createInfoBox(label1, value1, label2, value2) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: PURPLE };
  const borders = { top: border, bottom: border, left: border, right: border };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 4680, type: WidthType.DXA },
            shading: { fill: "F5F3FF", type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 150, right: 150 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: label1 + ": ", bold: true, size: 22 }),
                  new TextRun({ text: value1, size: 22 }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders,
            width: { size: 4680, type: WidthType.DXA },
            shading: { fill: "F5F3FF", type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 150, right: 150 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: label2 + ": ", bold: true, size: 22 }),
                  new TextRun({ text: value2, size: 22 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Helper: Contact Table
function createContactTable() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  const rows = [
    ["Data Controller", "ToraShaout (Pvt) Ltd"],
    ["Parent Company", "StatoTech"],
    ["Registered Address", "7514 Kuwadzana3, Harare, Zimbabwe"],
    ["Email", "info@torashout.com"],
    ["Data Protection Officer", "To Be Appointed"],
    ["DPO Email", "dpo@torashout.com"],
    ["POTRAZ Registration No.", "To Be Assigned"],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3500, 5860],
    rows: rows.map(
      ([label, value], index) =>
        new TableRow({
          children: [
            new TableCell({
              borders,
              width: { size: 3500, type: WidthType.DXA },
              shading: { fill: index === 0 ? "F3E8FF" : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 22 })] })],
            }),
            new TableCell({
              borders,
              width: { size: 5860, type: WidthType.DXA },
              shading: { fill: index === 0 ? "F3E8FF" : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: value, size: 22 })] })],
            }),
          ],
        })
    ),
  });
}

// Helper: Definitions List
function createDefinitionsList() {
  const definitions = [
    { term: "Personal Information", def: "Information relating to an identifiable person, including names, ID numbers, email addresses, phone numbers, IP addresses, online identifiers, and biometric data." },
    { term: "Data Subject", def: "The natural person to whom personal information relates (you, the user)." },
    { term: "Data Controller", def: "The person or entity that determines the purposes and means of processing personal information (ToraShaout)." },
    { term: "Processing", def: "Any operation performed on personal information, including collection, storage, use, transfer, or deletion." },
    { term: "Consent", def: "Any freely given, specific, informed, and unambiguous indication of your wishes regarding the processing of your personal information." },
    { term: "Biometric Data", def: "Physiological characteristics including fingerprints, facial recognition features, palm veins, and other unique biological identifiers." },
  ];

  return definitions.map(
    (d) =>
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [
          new TextRun({ text: d.term + ": ", bold: true }),
          new TextRun(d.def),
        ],
      })
  );
}

// Helper: Bullet List
function createBulletList(items) {
  return items.map(
    (item) =>
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun(item)],
      })
  );
}

// Helper: Legal Basis Table
function createLegalBasisTable() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  const data = [
    ["Legal Basis", "Purpose Examples"],
    ["Consent", "Marketing communications, non-essential cookies, processing of sensitive data"],
    ["Contractual Necessity", "Account creation, providing our services, processing transactions"],
    ["Legal Obligation", "Tax records, responding to lawful government requests, fraud prevention"],
    ["Legitimate Interests", "Platform security, analytics, fraud detection, service improvement"],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3000, 6360],
    rows: data.map(
      ([col1, col2], index) =>
        new TableRow({
          children: [
            new TableCell({
              borders,
              width: { size: 3000, type: WidthType.DXA },
              shading: { fill: index === 0 ? "7C3AED" : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: col1, bold: index === 0, size: 22, color: index === 0 ? "FFFFFF" : "000000" })] })],
            }),
            new TableCell({
              borders,
              width: { size: 6360, type: WidthType.DXA },
              shading: { fill: index === 0 ? "7C3AED" : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: col2, bold: index === 0, size: 22, color: index === 0 ? "FFFFFF" : "000000" })] })],
            }),
          ],
        })
    ),
  });
}

// Helper: Rights Table
function createRightsTable() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  const data = [
    ["Right", "Description"],
    ["Right to be Informed", "You have the right to know how your personal information is collected, used, and shared."],
    ["Right of Access", "You may request a copy of the personal information we hold about you."],
    ["Right to Rectification", "You may request correction of inaccurate or incomplete personal information."],
    ["Right to Erasure", "You may request deletion of your personal information in certain circumstances."],
    ["Right to Object", "You may object to processing of your personal information, including for direct marketing."],
    ["Right to Restrict Processing", "You may request that we limit how we use your personal information."],
    ["Right to Data Portability", "You may request to receive your personal information in a structured, commonly used format."],
    ["Right to Withdraw Consent", "Where processing is based on consent, you may withdraw it at any time."],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3000, 6360],
    rows: data.map(
      ([col1, col2], index) =>
        new TableRow({
          children: [
            new TableCell({
              borders,
              width: { size: 3000, type: WidthType.DXA },
              shading: { fill: index === 0 ? "7C3AED" : index % 2 === 0 ? "F9F5FF" : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: col1, bold: true, size: 22, color: index === 0 ? "FFFFFF" : "333333" })] })],
            }),
            new TableCell({
              borders,
              width: { size: 6360, type: WidthType.DXA },
              shading: { fill: index === 0 ? "7C3AED" : index % 2 === 0 ? "F9F5FF" : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: col2, size: 22, color: index === 0 ? "FFFFFF" : "000000" })] })],
            }),
          ],
        })
    ),
  });
}

// Helper: Breach Notification Table
function createBreachTable() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  const data = [
    ["Notification", "Timeframe", "Details"],
    ["POTRAZ", "Within 24 hours", "We will report the breach to the Data Protection Authority (POTRAZ) within 24 hours of becoming aware of it."],
    ["Affected Data Subjects", "Within 72 hours", "If the breach poses a high risk to your rights and freedoms, we will notify you within 72 hours with details of the breach and steps you can take."],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [2000, 2000, 5360],
    rows: data.map(
      ([col1, col2, col3], index) =>
        new TableRow({
          children: [
            new TableCell({
              borders,
              width: { size: 2000, type: WidthType.DXA },
              shading: { fill: index === 0 ? "DC2626" : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: col1, bold: true, size: 22, color: index === 0 ? "FFFFFF" : "000000" })] })],
            }),
            new TableCell({
              borders,
              width: { size: 2000, type: WidthType.DXA },
              shading: { fill: index === 0 ? "DC2626" : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: col2, bold: index === 0, size: 22, color: index === 0 ? "FFFFFF" : "000000" })] })],
            }),
            new TableCell({
              borders,
              width: { size: 5360, type: WidthType.DXA },
              shading: { fill: index === 0 ? "DC2626" : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: col3, bold: index === 0, size: 22, color: index === 0 ? "FFFFFF" : "000000" })] })],
            }),
          ],
        })
    ),
  });
}

// Helper: Retention Table
function createRetentionTable() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  const data = [
    ["Data Category", "Retention Period"],
    ["Account Information", "Duration of account + 2 years after closure"],
    ["Transaction Records", "7 years (legal/tax requirements)"],
    ["Customer Support Communications", "3 years from resolution"],
    ["Marketing Preferences", "Until consent withdrawn"],
    ["Video Content (Celebrities)", "Duration of agreement + 1 year"],
    ["Analytics Data", "2 years (anonymised thereafter)"],
    ["Security Logs", "1 year"],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [4680, 4680],
    rows: data.map(
      ([col1, col2], index) =>
        new TableRow({
          children: [
            new TableCell({
              borders,
              width: { size: 4680, type: WidthType.DXA },
              shading: { fill: index === 0 ? "7C3AED" : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: col1, bold: index === 0, size: 22, color: index === 0 ? "FFFFFF" : "000000" })] })],
            }),
            new TableCell({
              borders,
              width: { size: 4680, type: WidthType.DXA },
              shading: { fill: index === 0 ? "7C3AED" : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: col2, size: 22, color: index === 0 ? "FFFFFF" : "000000" })] })],
            }),
          ],
        })
    ),
  });
}

// Helper: POTRAZ Table
function createPOTRAZTable() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: "FEF3C7", type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 150, right: 150 },
            children: [
              new Paragraph({
                spacing: { after: 80 },
                children: [new TextRun({ text: "Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ)", bold: true, size: 24 })],
              }),
              new Paragraph({
                spacing: { after: 40 },
                children: [new TextRun({ text: "Block A, Emerald Business Park", size: 22 })],
              }),
              new Paragraph({
                spacing: { after: 40 },
                children: [new TextRun({ text: "30 The Chase (West), Emerald Hill, Harare", size: 22 })],
              }),
              new Paragraph({
                spacing: { after: 40 },
                children: [new TextRun({ text: "Phone: +263 (4) 333311", size: 22 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: "Website: www.potraz.gov.zw", size: 22 })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Helper: Final Contact Table
function createFinalContactTable() {
  const border = { style: BorderStyle.SINGLE, size: 1, color: PURPLE };
  const borders = { top: border, bottom: border, left: border, right: border };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: "F5F3FF", type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 150, right: 150 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: "TORA", bold: true, size: 32, color: PURPLE }),
                  new TextRun({ text: "SHAOUT", bold: true, size: 32, color: PINK }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [new TextRun({ text: "ToraShaout (Pvt) Ltd", bold: true, size: 24 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 40 },
                children: [new TextRun({ text: "7514 Kuwadzana3", size: 22 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 40 },
                children: [new TextRun({ text: "Harare, Zimbabwe", size: 22 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 40 },
                children: [
                  new TextRun({ text: "Email: ", size: 22 }),
                  new TextRun({ text: "info@torashout.com", color: PURPLE, size: 22 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "DPO Email: ", size: 22 }),
                  new TextRun({ text: "dpo@torashout.com", color: PURPLE, size: 22 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Generate the document
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/mnt/user-data/outputs/ToraShaout-Privacy-Policy-Zimbabwe.docx", buffer);
  console.log("Privacy Policy created successfully!");
});
