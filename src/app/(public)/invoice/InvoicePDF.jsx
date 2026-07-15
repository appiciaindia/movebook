import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#333",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  logo: {
    width: 80,
    height: 80,
  },

  company: {
    textAlign: "right",
    width: "55%",
  },

  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B4EA2",
  },

  heading: {
    backgroundColor: "#0B4EA2",
    color: "#fff",
    padding: 6,
    marginTop: 15,
    marginBottom: 8,
    fontSize: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  box: {
    width: "48%",
    border: "1 solid #ccc",
    padding: 8,
  },

  label: {
    fontWeight: "bold",
    marginBottom: 3,
  },

  table: {
    width: "100%",
    border: "1 solid #000",
    marginTop: 10,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0B4EA2",
    color: "#fff",
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #ccc",
  },

  col1: {
    width: "10%",
    padding: 6,
    borderRight: "1 solid #ccc",
  },

  col2: {
    width: "45%",
    padding: 6,
    borderRight: "1 solid #ccc",
  },

  col3: {
    width: "15%",
    padding: 6,
    borderRight: "1 solid #ccc",
  },

  col4: {
    width: "15%",
    padding: 6,
    borderRight: "1 solid #ccc",
  },

  col5: {
    width: "15%",
    padding: 6,
  },

  summary: {
    width: "40%",
    marginLeft: "auto",
    marginTop: 20,
    border: "1 solid #000",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    borderBottom: "1 solid #ccc",
  },

  bank: {
    marginTop: 20,
    border: "1 solid #ccc",
    padding: 10,
  },

  terms: {
    marginTop: 20,
  },

  signature: {
    marginTop: 40,
    textAlign: "right",
  },
});

export default function InvoicePDF() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}

        <View style={styles.header}>

          <Image
            src="https://dummyimage.com/120x120/0b4ea2/ffffff&text=LOGO"
            style={styles.logo}
          />

          <View style={styles.company}>
            <Text style={styles.companyName}>
              APPICIA MOVERS
            </Text>

            <Text>Jaipur, Rajasthan</Text>
            <Text>+91 9999999999</Text>
            <Text>info@appicia.com</Text>
            <Text>www.appicia.com</Text>
            <Text>GST : 08ABCDE1234F1Z5</Text>
          </View>

        </View>

        <Text style={styles.heading}>
          QUOTATION
        </Text>

        {/* CUSTOMER */}

        <View style={styles.row}>

          <View style={styles.box}>
            <Text style={styles.label}>Customer Details</Text>

            <Text>Name : Rohit Sharma</Text>
            <Text>Mobile : 9999999999</Text>
            <Text>Email : test@gmail.com</Text>
            <Text>From : Jaipur</Text>
            <Text>To : Delhi</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>Quotation Details</Text>

            <Text>Quotation : QT0001</Text>
            <Text>Date : 20-07-2026</Text>
            <Text>Packing : 22-07-2026</Text>
            <Text>Moving : 23-07-2026</Text>
          </View>

        </View>

        {/* TABLE */}

        <View style={styles.table}>

          <View style={styles.tableHeader}>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col2}>Description</Text>
            <Text style={styles.col3}>Qty</Text>
            <Text style={styles.col4}>Price</Text>
            <Text style={styles.col5}>Total</Text>
          </View>

          {[1,2,3,4,5].map((item)=>(
            <View style={styles.tableRow} key={item}>
              <Text style={styles.col1}>{item}</Text>
              <Text style={styles.col2}>
                Household Item Packing
              </Text>
              <Text style={styles.col3}>1</Text>
              <Text style={styles.col4}>₹2000</Text>
              <Text style={styles.col5}>₹2000</Text>
            </View>
          ))}

        </View>

        {/* SUMMARY */}

        <View style={styles.summary}>

          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>₹10000</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>GST (18%)</Text>
            <Text>₹1800</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>Insurance</Text>
            <Text>₹500</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>Advance</Text>
            <Text>₹3000</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>Total Payable</Text>
            <Text>₹9300</Text>
          </View>

        </View>

        {/* BANK */}

        <View style={styles.bank}>

          <Text style={{fontWeight:"bold",marginBottom:5}}>
            Bank Details
          </Text>

          <Text>Beneficiary : APPICIA MOVERS</Text>
          <Text>Bank : HDFC Bank</Text>
          <Text>Account : 1234567890</Text>
          <Text>IFSC : HDFC0001234</Text>
          <Text>UPI : appicia@ybl</Text>

        </View>

        {/* TERMS */}

        <View style={styles.terms}>

          <Text style={{fontWeight:"bold"}}>
            Terms & Conditions
          </Text>

          <Text>• Advance payment required.</Text>
          <Text>• Insurance optional.</Text>
          <Text>• GST extra as applicable.</Text>
          <Text>• Quotation valid for 7 days.</Text>

        </View>

        {/* SIGN */}

        <View style={styles.signature}>
          <Text>Authorized Signatory</Text>
        </View>

      </Page>
    </Document>
  );
}