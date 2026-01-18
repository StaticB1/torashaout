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
  PageBreak,
} = require("docx");
const fs = require("fs");

// Brand colors
const PURPLE = "7C3AED";
const PINK = "EC4899";

// Document info
const effectiveDate = "17 January 2026";
const lastUpdated = "17 January 2026";

// Company info
const COMPANY = {
  name: "ToraShaout",
  legalName: "ToraShaout (Pvt) Ltd",
  parent: "StatoTech",
  address: "7514 Kuwadzana3, Harare, Zimbabwe",
  email: "info@torashout.com",
  supportEmail: "support@torashout.com",
  legalEmail: "legal@torashout.com",
};

// Helper functions
function createBulletList(items) {
  return items.map(
    (item) =>
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 80 },
        children: Array.isArray(item) 
          ? item 
          : [new TextRun(item)],
      })
  );
}

function createNumberedList(items, ref = "numbers") {
  return items.map(
    (item) =>
      new Paragraph({
        numbering: { reference: ref, level: 0 },
        spacing: { after: 80 },
        children: Array.isArray(item) 
          ? item 
          : [new TextRun(item)],
      })
  );
}

function createTable(data, headerBgColor = PURPLE) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3500, 5860],
    rows: data.map(
      ([col1, col2], index) =>
        new TableRow({
          children: [
            new TableCell({
              borders,
              width: { size: 3500, type: WidthType.DXA },
              shading: { 
                fill: index === 0 ? headerBgColor : (index % 2 === 0 ? "F5F3FF" : "FFFFFF"), 
                type: ShadingType.CLEAR 
              },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({ 
                  children: [
                    new TextRun({ 
                      text: col1, 
                      bold: index === 0, 
                      size: 22, 
                      color: index === 0 ? "FFFFFF" : "333333" 
                    })
                  ] 
                })
              ],
            }),
            new TableCell({
              borders,
              width: { size: 5860, type: WidthType.DXA },
              shading: { 
                fill: index === 0 ? headerBgColor : (index % 2 === 0 ? "F5F3FF" : "FFFFFF"), 
                type: ShadingType.CLEAR 
              },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({ 
                  children: [
                    new TextRun({ 
                      text: col2, 
                      bold: index === 0, 
                      size: 22, 
                      color: index === 0 ? "FFFFFF" : "000000" 
                    })
                  ] 
                })
              ],
            }),
          ],
        })
    ),
  });
}

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
                  new TextRun({ text: `${label1}: `, bold: true, size: 22 }),
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
                  new TextRun({ text: `${label2}: `, bold: true, size: 22 }),
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

// Create the document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 24 },
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
      {
        reference: "alpha",
        levels: [
          {
            level: 0,
            format: LevelFormat.LOWER_LETTER,
            text: "(%1)",
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
          size: { width: 12240, height: 15840 },
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
                new TextRun({ text: " | Terms and Conditions", color: "666666", size: 22 }),
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
                new TextRun({ text: `© ${new Date().getFullYear()} ${COMPANY.legalName} | A ${COMPANY.parent} Company`, size: 18, color: "888888" }),
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
            new TextRun({ text: "TERMS AND CONDITIONS", bold: true, size: 40, color: "333333" }),
          ],
        }),

        // Info Box
        createInfoBox("Effective Date", effectiveDate, "Last Updated", lastUpdated),
        new Paragraph({ spacing: { after: 300 }, children: [] }),

        // Important Notice Box
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnWidths: [9360],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 2, color: "DC2626" },
                    bottom: { style: BorderStyle.SINGLE, size: 2, color: "DC2626" },
                    left: { style: BorderStyle.SINGLE, size: 2, color: "DC2626" },
                    right: { style: BorderStyle.SINGLE, size: 2, color: "DC2626" },
                  },
                  width: { size: 9360, type: WidthType.DXA },
                  shading: { fill: "FEF2F2", type: ShadingType.CLEAR },
                  margins: { top: 120, bottom: 120, left: 150, right: 150 },
                  children: [
                    new Paragraph({
                      spacing: { after: 80 },
                      children: [
                        new TextRun({ text: "⚠️ IMPORTANT: PLEASE READ CAREFULLY", bold: true, size: 24, color: "DC2626" }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({ text: "By accessing or using ToraShaout, you agree to be bound by these Terms and Conditions. If you do not agree, you must not use our Platform. These Terms constitute a legally binding agreement between you and ToraShaout (Pvt) Ltd.", size: 22 }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new Paragraph({ spacing: { after: 200 }, children: [] }),

        // 1. Introduction
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("1. Introduction")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("Welcome to ToraShaout (\""),
            new TextRun({ text: "Platform", bold: true }),
            new TextRun("\"), a celebrity video marketplace that connects fans with celebrities for personalised video content. These Terms and Conditions (\""),
            new TextRun({ text: "Terms", bold: true }),
            new TextRun("\") govern your access to and use of the ToraShaout website, mobile applications, and all related services (collectively, the \""),
            new TextRun({ text: "Services", bold: true }),
            new TextRun("\")."),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("ToraShaout is owned and operated by "),
            new TextRun({ text: COMPANY.legalName, bold: true }),
            new TextRun(", a company registered in Zimbabwe (\""),
            new TextRun({ text: "ToraShaout", bold: true }),
            new TextRun("\", \""),
            new TextRun({ text: "we", bold: true }),
            new TextRun("\", \""),
            new TextRun({ text: "us", bold: true }),
            new TextRun("\", \""),
            new TextRun({ text: "our", bold: true }),
            new TextRun("\"), a subsidiary of StatoTech."),
          ],
        }),

        // 2. Definitions
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("2. Definitions")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun("In these Terms, unless the context otherwise requires:")],
        }),
        createTable([
          ["Term", "Definition"],
          ["\"Celebrity\" or \"Talent\"", "A verified individual who creates personalised video content on the Platform in exchange for payment."],
          ["\"Fan\" or \"User\"", "Any individual who uses the Platform to request, purchase, or view personalised video content."],
          ["\"Video Request\"", "A request submitted by a Fan for a Celebrity to create a personalised video message."],
          ["\"Personalised Video\"", "A custom video created by a Celebrity in response to a Video Request."],
          ["\"Platform Fee\"", "The service fee charged by ToraShaout for facilitating transactions between Fans and Celebrities."],
          ["\"Content\"", "All videos, images, text, audio, and other materials uploaded to or created on the Platform."],
          ["\"Account\"", "A registered user profile on the Platform, whether as a Fan or Celebrity."],
        ]),
        new Paragraph({ spacing: { after: 200 }, children: [] }),

        // 3. Acceptance of Terms
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("3. Acceptance of Terms")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: "3.1 ", bold: true }),
            new TextRun("By creating an Account, accessing, or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and any additional terms and policies referenced herein."),
          ],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: "3.2 ", bold: true }),
            new TextRun("We may modify these Terms at any time. We will notify you of material changes by posting the updated Terms on the Platform and updating the \"Last Updated\" date. Your continued use of the Services after such changes constitutes acceptance of the modified Terms."),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "3.3 ", bold: true }),
            new TextRun("If you are using the Services on behalf of an organisation, you represent and warrant that you have authority to bind that organisation to these Terms."),
          ],
        }),

        // 4. Eligibility
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("4. Eligibility")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun("To use our Services, you must:")],
        }),
        ...createBulletList([
          "Be at least 18 years of age, or between 13 and 18 years of age with verifiable parental or guardian consent;",
          "Have the legal capacity to enter into a binding contract under Zimbabwean law;",
          "Not be prohibited from using the Services under any applicable law;",
          "Not have been previously suspended or removed from the Platform;",
          "Provide accurate, current, and complete information during registration.",
        ]),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Note for Celebrities: ", bold: true }),
            new TextRun("You must be at least 18 years of age to register as a Celebrity on the Platform. There are no exceptions to this requirement."),
          ],
        }),

        // 5. Account Registration
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("5. Account Registration and Security")],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("5.1 Account Creation")],
        }),
        ...createBulletList([
          "You must register for an Account to access certain features of the Platform.",
          "You agree to provide accurate, current, and complete registration information.",
          "You must promptly update your information if it changes.",
          "You may not create more than one personal Account.",
          "You may not use another person's Account without permission.",
        ]),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("5.2 Account Security")],
        }),
        ...createBulletList([
          "You are responsible for maintaining the confidentiality of your Account credentials.",
          "You are responsible for all activities that occur under your Account.",
          "You must immediately notify us of any unauthorised use of your Account.",
          "We are not liable for any loss arising from unauthorised use of your Account.",
        ]),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("5.3 Celebrity Verification")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("Celebrities must undergo identity verification before being approved on the Platform. This may include providing government-issued identification, social media verification, and other information we reasonably require. We reserve the right to reject any Celebrity application at our sole discretion."),
          ],
        }),

        // 6. Platform Services
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("6. Platform Services")],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("6.1 Description of Services")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("ToraShaout provides a marketplace platform that enables:"),
          ],
        }),
        ...createBulletList([
          "Fans to discover Celebrities and request personalised video messages;",
          "Celebrities to receive, accept, and fulfil video requests from Fans;",
          "Secure payment processing for transactions between Fans and Celebrities;",
          "Delivery of completed videos through the Platform;",
          "Communication between Fans and Celebrities regarding video requests.",
        ]),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("6.2 Platform Role")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "ToraShaout acts solely as an intermediary platform. ", bold: true }),
            new TextRun("We facilitate connections between Fans and Celebrities but are not a party to the transactions between them. Celebrities are independent contractors, not employees or agents of ToraShaout."),
          ],
        }),

        // 7. Fan Terms
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("7. Terms for Fans")],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("7.1 Submitting Video Requests")],
        }),
        ...createBulletList([
          "When submitting a Video Request, you must provide clear and appropriate instructions.",
          "Requests must comply with our Content Guidelines (Section 11).",
          "You acknowledge that Celebrities have discretion to decline requests.",
          "Video delivery times are estimates and may vary.",
        ]),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("7.2 Payments")],
        }),
        ...createBulletList([
          "Payment is required at the time of submitting a Video Request.",
          "All prices are displayed in the applicable currency and include Platform fees.",
          "You authorise us to charge your selected payment method for the full amount.",
          "Payment is held until the Celebrity fulfils the request or the request expires.",
        ]),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("7.3 Refunds")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun("You may be entitled to a refund in the following circumstances:")],
        }),
        ...createBulletList([
          "The Celebrity does not fulfil your request within the specified timeframe;",
          "The delivered video substantially fails to address your request instructions;",
          "Technical issues on our Platform prevent delivery of the video.",
        ]),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("Refund requests must be submitted within "),
            new TextRun({ text: "7 days", bold: true }),
            new TextRun(" of the video delivery or request expiration. We reserve the right to determine refund eligibility at our reasonable discretion."),
          ],
        }),

        // 8. Celebrity Terms
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("8. Terms for Celebrities")],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("8.1 Onboarding and Profile")],
        }),
        ...createBulletList([
          "You must complete our verification process before accepting requests.",
          "You must maintain an accurate and up-to-date profile.",
          "You set your own prices for video requests, subject to Platform minimums.",
          "You determine your availability and response timeframes.",
        ]),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("8.2 Fulfilling Requests")],
        }),
        ...createBulletList([
          "You must fulfil accepted requests within your stated delivery timeframe.",
          "Videos must be personalised and address the Fan's specific instructions.",
          "Videos must meet our quality standards and Content Guidelines.",
          "You may decline requests for any reason, but excessive declines may affect your visibility.",
        ]),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("8.3 Payments to Celebrities")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun("Payment terms for Celebrities:")],
        }),
        createTable([
          ["Item", "Details"],
          ["Revenue Share", "Celebrities receive 75% of the video price; ToraShaout retains 25% as Platform Fee."],
          ["Payment Schedule", "Payments are processed weekly for all completed videos."],
          ["Payment Methods", "EcoCash, OneMoney, or bank transfer (as available)."],
          ["Minimum Payout", "USD $10 or equivalent in local currency."],
          ["Payment Holds", "Payments may be held for 7 days for quality assurance."],
        ]),
        new Paragraph({ spacing: { after: 200 }, children: [] }),

        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("8.4 Taxes")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("Celebrities are responsible for reporting and paying all applicable taxes on their earnings. ToraShaout may be required to report earnings to tax authorities as required by Zimbabwean law. You agree to provide any tax documentation we reasonably request."),
          ],
        }),

        // 9. Fees and Payments
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("9. Fees and Payment Terms")],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("9.1 Platform Fees")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("ToraShaout charges a Platform Fee of "),
            new TextRun({ text: "25%", bold: true }),
            new TextRun(" on each completed transaction. This fee covers payment processing, platform maintenance, customer support, and other operational costs."),
          ],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("9.2 Payment Methods")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun("We accept the following payment methods:")],
        }),
        ...createBulletList([
          "Mobile Money (EcoCash, OneMoney)",
          "Debit and Credit Cards (Visa, Mastercard)",
          "Bank Transfers",
          "Other payment methods as may be made available",
        ]),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("9.3 Currency")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("Prices may be displayed in USD, ZWL, or other currencies. Currency conversion rates are determined at the time of transaction and may include conversion fees."),
          ],
        }),

        // 10. Intellectual Property
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("10. Intellectual Property Rights")],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("10.1 Platform Ownership")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("The Platform, including its design, features, functionality, and all related intellectual property (trademarks, logos, software, content), is owned by ToraShaout and protected by Zimbabwean and international intellectual property laws. The TORA"),
            new TextRun({ text: "SHAOUT", color: PINK }),
            new TextRun(" name and logo are registered trademarks of ToraShaout (Pvt) Ltd."),
          ],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("10.2 Celebrity Content")],
        }),
        ...createBulletList([
          "Celebrities retain ownership of the videos they create.",
          "By uploading content, Celebrities grant ToraShaout a non-exclusive, worldwide, royalty-free licence to host, display, and distribute videos through the Platform.",
          "Celebrities grant Fans a limited, personal, non-commercial licence to view and share purchased videos.",
        ]),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("10.3 Fan Rights")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("Fans receive a limited, non-exclusive licence to view and share their purchased Personalised Videos for personal, non-commercial purposes. Fans may "),
            new TextRun({ text: "not", bold: true }),
            new TextRun(" sell, sublicence, or commercially exploit purchased videos without express written permission from the Celebrity and ToraShaout."),
          ],
        }),

        // 11. Content Guidelines
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("11. Content Guidelines and Prohibited Content")],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("11.1 General Standards")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun("All content on the Platform must:")],
        }),
        ...createBulletList([
          "Be legal under Zimbabwean law and the laws of any applicable jurisdiction;",
          "Be appropriate for a general audience unless specifically marked otherwise;",
          "Respect the rights and dignity of all individuals;",
          "Not infringe any third-party intellectual property rights.",
        ]),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("11.2 Prohibited Content")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun("The following content is strictly prohibited:")],
        }),
        ...createBulletList([
          "Content that is illegal, harmful, threatening, abusive, harassing, defamatory, or hateful;",
          "Sexually explicit or pornographic material;",
          "Content depicting violence, self-harm, or dangerous activities;",
          "Content that exploits or endangers minors in any way;",
          "Content that promotes discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or national origin;",
          "Content that infringes intellectual property rights;",
          "Spam, malware, or any malicious content;",
          "False, misleading, or deceptive content;",
          "Content that violates any person's privacy rights;",
          "Political campaign content or election-related propaganda;",
          "Content promoting illegal drugs, weapons, or other contraband.",
        ]),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Violation of these guidelines may result in content removal, account suspension, or permanent ban from the Platform.", bold: true }),
          ],
        }),

        // 12. Prohibited Conduct
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("12. Prohibited Conduct")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun("You agree not to:")],
        }),
        ...createBulletList([
          "Use the Platform for any illegal purpose or in violation of any laws;",
          "Impersonate any person or entity or misrepresent your affiliation;",
          "Attempt to circumvent Platform fees or payment systems;",
          "Engage in transactions outside the Platform to avoid fees;",
          "Harass, bully, or intimidate other users;",
          "Collect or store personal information about other users without consent;",
          "Use automated systems (bots, scrapers) to access the Platform;",
          "Attempt to gain unauthorised access to Platform systems;",
          "Interfere with or disrupt the Platform or servers;",
          "Reverse engineer, decompile, or disassemble any Platform software;",
          "Create multiple accounts to circumvent restrictions;",
          "Solicit Celebrities or Fans for services outside the Platform.",
        ]),

        // 13. Disclaimers
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("13. Disclaimers")],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("13.1 Platform Provided \"As Is\"")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: "THE PLATFORM AND SERVICES ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, ", bold: true }),
            new TextRun("either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement."),
          ],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("13.2 No Guarantee")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun("We do not warrant that:")],
        }),
        ...createBulletList([
          "The Platform will meet your specific requirements;",
          "The Platform will be uninterrupted, timely, secure, or error-free;",
          "Any Celebrity will accept or fulfil your request;",
          "The quality of any content will meet your expectations;",
          "Any errors in the Platform will be corrected.",
        ]),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("13.3 Third-Party Content")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("We are not responsible for the content created by Celebrities or any third parties. We do not endorse, guarantee, or assume responsibility for any Celebrity's statements, opinions, or content."),
          ],
        }),

        // 14. Limitation of Liability
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("14. Limitation of Liability")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: "14.1 ", bold: true }),
            new TextRun("TO THE MAXIMUM EXTENT PERMITTED BY ZIMBABWEAN LAW, TORASHOUT AND ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL."),
          ],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: "14.2 ", bold: true }),
            new TextRun("Our total liability for any claims arising from your use of the Platform shall not exceed the greater of: (a) the amounts you have paid to ToraShaout in the 12 months prior to the claim; or (b) USD $100."),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "14.3 ", bold: true }),
            new TextRun("These limitations apply regardless of the theory of liability (contract, tort, strict liability, or otherwise) and even if ToraShaout has been advised of the possibility of such damages."),
          ],
        }),

        // 15. Indemnification
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("15. Indemnification")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("You agree to indemnify, defend, and hold harmless ToraShaout and its directors, officers, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or relating to: (a) your use of the Platform; (b) your violation of these Terms; (c) your violation of any rights of another party; (d) any content you submit or create on the Platform; or (e) your negligence or wilful misconduct."),
          ],
        }),

        // 16. Termination
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("16. Termination")],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("16.1 Termination by You")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("You may close your Account at any time by contacting us at "),
            new TextRun({ text: COMPANY.supportEmail, color: PURPLE }),
            new TextRun(". Termination does not relieve you of obligations incurred before termination."),
          ],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("16.2 Termination by ToraShaout")],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun("We may suspend or terminate your Account at any time, with or without cause, including if we believe:")],
        }),
        ...createBulletList([
          "You have violated these Terms or our policies;",
          "You have engaged in fraudulent or illegal activity;",
          "Your conduct harms other users or the Platform;",
          "Termination is required by law or regulatory authorities.",
        ]),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("16.3 Effect of Termination")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("Upon termination: (a) your right to use the Platform ceases immediately; (b) we may delete your Account and content; (c) pending transactions may be cancelled or completed at our discretion; (d) provisions that by their nature should survive termination will survive."),
          ],
        }),

        // 17. Dispute Resolution
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("17. Dispute Resolution")],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("17.1 Informal Resolution")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("Before initiating formal dispute resolution, you agree to contact us at "),
            new TextRun({ text: COMPANY.legalEmail, color: PURPLE }),
            new TextRun(" to attempt to resolve the dispute informally. We will attempt to resolve complaints within 30 days."),
          ],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("17.2 Mediation")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun("If informal resolution fails, either party may request mediation before a mutually agreed mediator in Harare, Zimbabwe. The costs of mediation shall be shared equally unless otherwise agreed."),
          ],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("17.3 Arbitration")],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun("If mediation fails, disputes shall be resolved by binding arbitration in accordance with the Arbitration Act [Chapter 7:15] of Zimbabwe. Arbitration shall take place in Harare, Zimbabwe. The arbitrator's decision shall be final and binding."),
          ],
        }),

        // 18. Governing Law
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("18. Governing Law and Jurisdiction")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: "18.1 ", bold: true }),
            new TextRun("These Terms shall be governed by and construed in accordance with the laws of the "),
            new TextRun({ text: "Republic of Zimbabwe", bold: true }),
            new TextRun(", without regard to its conflict of law principles."),
          ],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: "18.2 ", bold: true }),
            new TextRun("Subject to the dispute resolution provisions above, you consent to the exclusive jurisdiction of the courts of Zimbabwe for any legal proceedings."),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "18.3 ", bold: true }),
            new TextRun("These Terms are subject to the Constitution of Zimbabwe and all applicable statutory requirements, including but not limited to the Cyber and Data Protection Act [Chapter 12:07], Consumer Protection Act, and Electronic Transactions Act."),
          ],
        }),

        // 19. General Provisions
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("19. General Provisions")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: "19.1 Entire Agreement: ", bold: true }),
            new TextRun("These Terms, together with our Privacy Policy and any other policies incorporated by reference, constitute the entire agreement between you and ToraShaout regarding the Services."),
          ],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: "19.2 Severability: ", bold: true }),
            new TextRun("If any provision of these Terms is found to be invalid or unenforceable, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect."),
          ],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: "19.3 Waiver: ", bold: true }),
            new TextRun("Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision."),
          ],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: "19.4 Assignment: ", bold: true }),
            new TextRun("You may not assign or transfer these Terms without our prior written consent. We may assign our rights and obligations without restriction."),
          ],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({ text: "19.5 Force Majeure: ", bold: true }),
            new TextRun("We shall not be liable for any failure to perform due to causes beyond our reasonable control, including natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, epidemics, or internet or telecommunications failures."),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "19.6 Notices: ", bold: true }),
            new TextRun("We may provide notices to you via email, posting on the Platform, or other reasonable means. Notices to us must be sent to our registered address or "),
            new TextRun({ text: COMPANY.legalEmail, color: PURPLE }),
            new TextRun("."),
          ],
        }),

        // 20. Contact Information
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("20. Contact Information")],
        }),
        new Paragraph({
          spacing: { after: 150 },
          children: [new TextRun("If you have any questions about these Terms, please contact us:")],
        }),

        // Contact Box
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnWidths: [9360],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: PURPLE },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: PURPLE },
                    left: { style: BorderStyle.SINGLE, size: 1, color: PURPLE },
                    right: { style: BorderStyle.SINGLE, size: 1, color: PURPLE },
                  },
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
                      children: [new TextRun({ text: COMPANY.legalName, bold: true, size: 24 })],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 40 },
                      children: [new TextRun({ text: COMPANY.address, size: 22 })],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 40 },
                      children: [
                        new TextRun({ text: "General Enquiries: ", size: 22 }),
                        new TextRun({ text: COMPANY.email, color: PURPLE, size: 22 }),
                      ],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 40 },
                      children: [
                        new TextRun({ text: "Support: ", size: 22 }),
                        new TextRun({ text: COMPANY.supportEmail, color: PURPLE, size: 22 }),
                      ],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({ text: "Legal: ", size: 22 }),
                        new TextRun({ text: COMPANY.legalEmail, color: PURPLE, size: 22 }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new Paragraph({ spacing: { after: 400 }, children: [] }),

        // Acknowledgment
        new Paragraph({
          alignment: AlignmentType.CENTER,
          shading: { fill: "F5F3FF", type: ShadingType.CLEAR },
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({ text: "By using ToraShaout, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.", italics: true, size: 22 }),
          ],
        }),

        // Version
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 300 },
          children: [
            new TextRun({ text: `Document Version: 1.0 | Effective: ${effectiveDate}`, size: 20, color: "888888" }),
          ],
        }),
      ],
    },
  ],
});

// Generate document
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/mnt/user-data/outputs/ToraShaout-Terms-and-Conditions.docx", buffer);
  console.log("Terms and Conditions created successfully!");
});
