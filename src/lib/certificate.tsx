/**
 * Course-completion certificate. Renders a one-page A4 PDF, server-side
 * only. Uses @react-pdf/renderer (Node-side React → PDF, no browser).
 */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Font,
} from "@react-pdf/renderer";
import React from "react";

const PALETTE = {
  primary: "#1e1a1a",
  muted: "#4A4A4A",
  sage: "#1E4D4A",
  surface: "#F8F6F1",
  border: "#E5E1D8",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: PALETTE.surface,
    padding: 56,
    fontFamily: "Helvetica",
  },
  inner: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: PALETTE.border,
    borderStyle: "solid",
    borderRadius: 18,
    padding: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PALETTE.sage,
    marginRight: 10,
  },
  brand: {
    fontSize: 10,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: PALETTE.sage,
    fontFamily: "Helvetica-Bold",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: PALETTE.muted,
    marginBottom: 24,
  },
  headline: {
    fontSize: 36,
    color: PALETTE.primary,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 18,
  },
  presented: {
    fontSize: 13,
    color: PALETTE.muted,
    marginBottom: 24,
    textAlign: "center",
  },
  name: {
    fontSize: 44,
    color: PALETTE.primary,
    fontFamily: "Helvetica-Oblique",
    textAlign: "center",
    marginBottom: 32,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
    borderBottomStyle: "solid",
  },
  body: {
    fontSize: 13,
    color: PALETTE.muted,
    textAlign: "center",
    lineHeight: 1.7,
    maxWidth: 460,
    marginBottom: 36,
  },
  bodyStrong: {
    fontSize: 13,
    color: PALETTE.primary,
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  footerCell: {
    fontSize: 10,
    color: PALETTE.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  footerValue: {
    fontSize: 12,
    color: PALETTE.primary,
    marginTop: 4,
    fontFamily: "Helvetica-Bold",
  },
});

function CertificateDocument({
  studentName,
  completedDate,
  certificateId,
  courseTitle,
}: {
  studentName: string;
  completedDate: Date;
  certificateId: string;
  courseTitle: string;
}) {
  const friendlyDate = completedDate.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <Document
      title={`${studentName} — ${courseTitle} certificate`}
      author="balance studios"
      subject="Certificate of completion"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.inner}>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brand}>balance studios</Text>
          </View>
          <Text style={styles.eyebrow}>Certificate of completion</Text>
          <Text style={styles.headline}>{courseTitle}</Text>
          <Text style={styles.presented}>This certificate is presented to</Text>
          <Text style={styles.name}>{studentName}</Text>
          <Text style={styles.body}>
            in recognition of the successful completion of every module,
            assessment and practical requirement of the balance studios Pilates
            Instructor Training programme on{" "}
            <Text style={styles.bodyStrong}>{friendlyDate}</Text>.
          </Text>
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerCell}>Issued by</Text>
              <Text style={styles.footerValue}>balance studios</Text>
            </View>
            <View>
              <Text style={styles.footerCell}>Certificate ID</Text>
              <Text style={styles.footerValue}>{certificateId}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function renderCertificate(args: {
  studentName: string;
  completedDate: Date;
  certificateId: string;
  courseTitle?: string;
}): Promise<Buffer> {
  return renderToBuffer(
    <CertificateDocument
      studentName={args.studentName}
      completedDate={args.completedDate}
      certificateId={args.certificateId}
      courseTitle={args.courseTitle ?? "Pilates Instructor Training"}
    />,
  );
}

// Quiet a Font import warning — Font is exported but unused in production code.
// Keeping the import means we can swap in a custom font later without churn.
void Font;
