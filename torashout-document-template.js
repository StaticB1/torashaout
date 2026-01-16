/**
 * =========================================================
 * TORASHOUT DOCUMENT TEMPLATE
 * =========================================================
 * 
 * Reusable template for creating professional ToraShaout
 * legal and business documents with consistent branding.
 * 
 * Usage: Copy this file and modify the CONTENT section
 * 
 * Brand Colors:
 *   - Purple: #7C3AED
 *   - Pink: #EC4899
 * 
 * =========================================================
 */

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

// =========================================================
// BRAND CONFIGURATION - DO NOT MODIFY
// =========================================================
const BRAND = {
  colors: {
    purple: "7C3AED",
    pink: "EC4899",
    darkGray: "333333",
    mediumGray: "666666",
    lightGray: "888888",
    border: "CCCCCC",
    purpleBg: "F5F3FF",
    pinkBg: "FDF2F8",
    yellowBg: "FEF3C7",
    redHeader: "DC2626",
  },
  company: {
    name: "ToraShaout",
    legalName: "ToraShaout (Pvt) Ltd",
    parent: "StatoTech",
    address: "7514 Kuwadzana3, Harare, Zimbabwe",
    email: "info@torashout.com",
    privacyEmail: "privacy@torashout.com",
    dpoEmail: "dpo@torashout.com",
    website: "www.torashout.com",
  },
};

// =========================================================
// DOCUMENT CONFIGURATION - MODIFY FOR EACH DOCUMENT
// =========================================================
const DOC_CONFIG = {
  title: "DOCUMENT TITLE",           // e.g., "PRIVACY POLICY", "TERMS OF SERVICE"
  subtitle: "",                       // Optional subtitle
  effectiveDate: "17 January 2026",
  lastUpdated: "17 January 2026",
  version: "1.0",
  outputFileName: "ToraShaout-Document.docx",
};

// =========================================================
// HELPER FUNCTIONS - REUSABLE COMPONENTS
// =========================================================

/**
 * Creates the ToraShaout branded header
 */
function createBrandedHeader(docType = "Document") {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "TORA", bold: true, color: BRAND.colors.purple, size: 28 }),
          new TextRun({ text: "SHAOUT", bold: true, color: BRAND.colors.pink, size: 28 }),
          new TextRun({ text: ` | ${docType}`, color: BRAND.colors.mediumGray, size: 22 }),
        ],
      }),
    ],
  });
}

/**
 * Creates the standard footer with copyright and page numbers
 */
function createStandardFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ 
            text: `© ${new Date().getFullYear()} ${BRAND.company.legalName} | A ${BRAND.company.parent} Company`, 
            size: 18, 
            color: BRAND.colors.lightGray 
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Page ", size: 18, color: BRAND.colors.lightGray }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: BRAND.colors.lightGray }),
          new TextRun({ text: " of ", size: 18, color: BRAND.colors.lightGray }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: BRAND.colors.lightGray }),
        ],
      }),
    ],
  });
}

/**
 * Creates the main title block with logo
 */
function createTitleBlock(title, subtitle = "") {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "TORA", bold: true, size: 56, color: BRAND.colors.purple }),
        new TextRun({ text: "SHAOUT", bold: true, size: 56, color: BRAND.colors.pink }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: subtitle ? 100 : 400 },
      children: [
        new TextRun({ text: title, bold: true, size: 40, color: BRAND.colors.darkGray }),
      ],
    }),
  ];
  
  if (subtitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({ text: subtitle, size: 28, color: BRAND.colors.mediumGray }),
        ],
      })
    );
  }
  
  return children;
}

/**
 * Creates an info box with two columns (e.g., Effective Date | Last Updated)
 */
function createInfoBox(label1, value1, label2, value2) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: BRAND.colors.purple };
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
            shading: { fill: BRAND.colors.purpleBg, type: ShadingType.CLEAR },
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
            shading: { fill: BRAND.colors.purpleBg, type: ShadingType.CLEAR },
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

/**
 * Creates a simple two-column table
 */
function createTwoColumnTable(data, headerBgColor = BRAND.colors.purple) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: BRAND.colors.border };
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
                fill: index === 0 ? headerBgColor : (index % 2 === 0 ? BRAND.colors.purpleBg : "FFFFFF"), 
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
                      color: index === 0 ? "FFFFFF" : BRAND.colors.darkGray 
                    })
                  ] 
                })
              ],
            }),
            new TableCell({
              borders,
              width: { size: 5860, type: WidthType.DXA },
              shading: { 
                fill: index === 0 ? headerBgColor : (index % 2 === 0 ? BRAND.colors.purpleBg : "FFFFFF"), 
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

/**
 * Creates a three-column table
 */
function createThreeColumnTable(data, headerBgColor = BRAND.colors.purple) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: BRAND.colors.border };
  const borders = { top: border, bottom: border, left: border, right: border };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [2500, 2500, 4360],
    rows: data.map(
      ([col1, col2, col3], index) =>
        new TableRow({
          children: [
            new TableCell({
              borders,
              width: { size: 2500, type: WidthType.DXA },
              shading: { fill: index === 0 ? headerBgColor : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({ 
                  children: [
                    new TextRun({ 
                      text: col1, 
                      bold: index === 0, 
                      size: 22, 
                      color: index === 0 ? "FFFFFF" : "000000" 
                    })
                  ] 
                })
              ],
            }),
            new TableCell({
              borders,
              width: { size: 2500, type: WidthType.DXA },
              shading: { fill: index === 0 ? headerBgColor : "FFFFFF", type: ShadingType.CLEAR },
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
            new TableCell({
              borders,
              width: { size: 4360, type: WidthType.DXA },
              shading: { fill: index === 0 ? headerBgColor : "FFFFFF", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({ 
                  children: [
                    new TextRun({ 
                      text: col3, 
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

/**
 * Creates a highlighted box (for important notices, contact info, etc.)
 */
function createHighlightBox(content, bgColor = BRAND.colors.purpleBg) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: BRAND.colors.purple };
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
            shading: { fill: bgColor, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 150, right: 150 },
            children: content,
          }),
        ],
      }),
    ],
  });
}

/**
 * Creates a bullet list
 */
function createBulletList(items, numberingRef = "bullets") {
  return items.map(
    (item) =>
      new Paragraph({
        numbering: { reference: numberingRef, level: 0 },
        spacing: { after: 80 },
        children: [new TextRun(item)],
      })
  );
}

/**
 * Creates a numbered list
 */
function createNumberedList(items, numberingRef = "numbers") {
  return items.map(
    (item) =>
      new Paragraph({
        numbering: { reference: numberingRef, level: 0 },
        spacing: { after: 80 },
        children: [new TextRun(item)],
      })
  );
}

/**
 * Creates a standard paragraph
 */
function createParagraph(text, options = {}) {
  const { bold = false, italic = false, spacing = 200 } = options;
  return new Paragraph({
    spacing: { after: spacing },
    children: [new TextRun({ text, bold, italics: italic })],
  });
}

/**
 * Creates a heading
 */
function createHeading(text, level = 1) {
  const headingLevels = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
  };
  return new Paragraph({
    heading: headingLevels[level] || HeadingLevel.HEADING_1,
    children: [new TextRun(text)],
  });
}

/**
 * Creates a page break
 */
function createPageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

/**
 * Creates the contact info box
 */
function createContactBox() {
  return createHighlightBox([
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "TORA", bold: true, size: 32, color: BRAND.colors.purple }),
        new TextRun({ text: "SHAOUT", bold: true, size: 32, color: BRAND.colors.pink }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: BRAND.company.legalName, bold: true, size: 24 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: BRAND.company.address, size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({ text: "Email: ", size: 22 }),
        new TextRun({ text: BRAND.company.email, color: BRAND.colors.purple, size: 22 }),
      ],
    }),
  ]);
}

/**
 * Creates the version footer
 */
function createVersionFooter(version, effectiveDate) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 300 },
    children: [
      new TextRun({ 
        text: `Document Version: ${version} | Effective: ${effectiveDate}`, 
        size: 20, 
        color: BRAND.colors.lightGray 
      }),
    ],
  });
}

/**
 * Creates the acknowledgment box
 */
function createAcknowledgmentBox(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    shading: { fill: BRAND.colors.purpleBg, type: ShadingType.CLEAR },
    spacing: { before: 200, after: 200 },
    children: [
      new TextRun({ text, italics: true, size: 22 }),
    ],
  });
}

// =========================================================
// DOCUMENT STYLES - DO NOT MODIFY
// =========================================================
const documentStyles = {
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
        run: { size: 36, bold: true, font: "Arial", color: BRAND.colors.purple },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: BRAND.colors.darkGray },
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
};

// =========================================================
// PAGE SETTINGS - DO NOT MODIFY
// =========================================================
const pageSettings = {
  page: {
    size: { width: 12240, height: 15840 }, // US Letter
    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
  },
};

// =========================================================
// EXPORT FOR USE IN OTHER FILES
// =========================================================
module.exports = {
  BRAND,
  documentStyles,
  pageSettings,
  createBrandedHeader,
  createStandardFooter,
  createTitleBlock,
  createInfoBox,
  createTwoColumnTable,
  createThreeColumnTable,
  createHighlightBox,
  createBulletList,
  createNumberedList,
  createParagraph,
  createHeading,
  createPageBreak,
  createContactBox,
  createVersionFooter,
  createAcknowledgmentBox,
};

// =========================================================
// EXAMPLE USAGE (uncomment to test)
// =========================================================
/*
const doc = new Document({
  ...documentStyles,
  sections: [
    {
      properties: pageSettings,
      headers: { default: createBrandedHeader("Sample Document") },
      footers: { default: createStandardFooter() },
      children: [
        ...createTitleBlock("SAMPLE DOCUMENT", "A Subtitle Here"),
        createInfoBox("Effective Date", "17 January 2026", "Version", "1.0"),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        createHeading("1. Introduction"),
        createParagraph("This is a sample document using the ToraShaout template."),
        createHeading("2. Key Points", 2),
        ...createBulletList([
          "First bullet point",
          "Second bullet point",
          "Third bullet point",
        ]),
        createContactBox(),
        createVersionFooter("1.0", "17 January 2026"),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Sample-Document.docx", buffer);
  console.log("Document created!");
});
*/
