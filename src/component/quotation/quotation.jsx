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
    color: "#000",
    position: "relative",
  },
  pageBorder: {
    position: "absolute",
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    borderWidth: 1,
    borderColor: "#0B4EA2", // Theme Color
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  quotationDate: {
    width: "50%",
    color: "#000",
  },

  h4: {
    fontSize: 14,
  },

  h4Span: {
    fontSize: 16,
    fontWeight: "bold",
  },

  p: {
    fontSize: 11,
    lineHeight: 1,
    margin: 0,
  },

  pSpan: {
    fontWeight: "bold",
  },

  clientDetails: {
    marginTop: 10,
  },

  clientText: {
    fontSize: 11,
    lineHeight: 1,
    marginBottom: 2,
  },

  clientLabel: {
    fontSize: 11,
    fontWeight: "bold",
  },

  logo: {
    width: 150,
    height: 50,
    marginBottom: 3,
    float: "right",
  },

  company: {
    width: "50%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },

  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0B4EA2",
  },
  companyinfo: {
    fontSize: 11,
    lineHeight: 1,
    marginBottom: 2,
  },
  heading: {
    backgroundColor: "#0B4EA2",
    color: "#fff",
    padding: 6,
    marginTop: 0,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },

  box: {
    width: "48%",
  },
  moveText: {
    fontSize: 11,
    lineHeight: 1,
    marginBottom: 2,
  },

  moveLabel: {
    fontSize: 11,
    fontWeight: "bold",
  },

  label: {
    fontWeight: "bold",
    marginBottom: 3,
  },

  paymentDetails: {
    marginTop: 5,
  },

  paymentHeading: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#0B4EA2", // Theme Color
    padding: 5,
    marginBottom: 10,
  },

  paymentTable: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 11,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  tableCellLeft: {
    width: "70%",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },

  tableCellRight: {
    width: "30%",
    paddingVertical: 4,
    paddingHorizontal: 6,
    textAlign: "left",
  },

  tableData: {
    backgroundColor: "#0B4EA2",
    color: "#fff",
  },

  amountSection: {
    flexDirection: "row",
    marginTop: 20,
  },

  signatureSection: {
    width: "70%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingRight: 20,
  },

  amountTable: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  center: {
    textAlign: "center",
  },

  bold: {
    fontWeight: "bold",
  },
  remark: {
    fontSize: 11,
    marginTop: 15,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  tableCell: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  cellLabel: {
    width: "25%",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    fontWeight: "bold",
  },

  cellValue: {
    width: "25%",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },

  lastCell: {
    borderRightWidth: 0,
  },

  itemTable: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 12,
  },

  itemHeader: {
    flexDirection: "row",
    backgroundColor: "#0B4EA2", // Theme Color
    color: "#fff",
    fontWeight: "bold",
  },

  itemRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  itemCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },

  itemDescription: {
    width: "25%",
  },

  itemQty: {
    width: "15%",
    textAlign: "center",
  },

  itemValue: {
    width: "20%",
    textAlign: "right",
  },

  itemRemark: {
    width: "40%",
    borderRightWidth: 0,
  },

  termsSection: {
    marginTop: 20,
  },

  termsHeading: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },

  termsList: {
    fontSize: 10,
  },

  termsItem: {
    flexDirection: "row",
    marginBottom: 0,
    lineHeight: 1,
  },

  bullet: {
    width: 10,
    fontSize: 12,
  },

  termsText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1,
  },
});

export default function Quotation({ data }) {
  const subTotal = Number(data.sub_total || 0);

  const surchargePercent = Number(data.surcharge_percent || 0);
  const surchargeAmount = (subTotal * surchargePercent) / 100;

  const insuranceAmount =
    ((data.dec_val_of_goods || 0) * (data.insurance_percent || 0)) / 100;

  const insuranceGST = (insuranceAmount * (data.ins_gst_percent || 0)) / 100;

  const vehicleInsuranceAmount =
    ((data.dec_val_of_vehicle || 0) * (data.vehicle_insurance_percent || 0)) /
    100;

  const vehicleInsuranceGST =
    (vehicleInsuranceAmount * (data.vehicle_ins_gst_percent || 0)) / 100;

  const gstPercent = Number(data.gst_percent || 0);

  const totalGST = (subTotal * gstPercent) / 100;
  const cgst = totalGST / 2;
  const sgst = totalGST / 2;

  const totalAmount =
    (subTotal || 0) +
    (surchargeAmount || 0) +
    (totalGST || 0) +
    (insuranceAmount || 0) +
    (insuranceGST || 0) +
    (vehicleInsuranceAmount || 0) +
    (vehicleInsuranceGST || 0);

  const advancePaid = Number(data.advance_paid || 0);
  const payableAmount = totalAmount - advancePaid;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Border */}
        <View fixed style={styles.pageBorder} />
        {/* HEADER */}

        <View style={styles.header}>
          <view>
            <View style={styles.quotationDate}>
              <Text style={styles.h4}>
                <Text style={styles.h4Span}>Quotation No:</Text>
                {data?.quotation_number || "-"}
              </Text>

              <Text style={styles.p}>
                <Text style={styles.pSpan}>Date: </Text>{" "}
                {data?.quotation_date || "-"}
              </Text>

              <Text style={styles.p}>
                <Text style={styles.pSpan}>Packing Date: </Text>
                {data?.packing_date || "-"}
              </Text>

              <Text style={styles.p}>
                <Text style={styles.pSpan}>Moving Date: </Text>
                {data?.moving_date || "-"}
              </Text>
            </View>
            <View style={styles.clientDetails}>
              <Text style={styles.clientText}>
                <Text style={styles.clientLabel}>Company Name: </Text>
                {data?.quotation_company_name || "-"}
              </Text>

              <Text style={styles.clientText}>
                <Text style={styles.clientLabel}>Customer Name: </Text>
                {data?.party_name || "-"}
              </Text>

              <Text style={styles.clientText}>
                <Text style={styles.clientLabel}>Mobile: </Text>
                {data?.quotation_mobile || "-"}
              </Text>

              <Text style={styles.clientText}>
                <Text style={styles.clientLabel}>Email: </Text>
                {data?.quotation_email || "-"}
              </Text>
            </View>
          </view>

          <View style={styles.company}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${data.company_logo}`}
              style={{ height: 60 }}
            />
            {/* <Image src={data?.company_logo || "-"} style={styles.logo} /> */}
            <Text style={styles.companyName}>{data?.company_name || "-"}</Text>

            <Text style={styles.companyinfo}>{data?.address || "-"}</Text>
            <Text style={styles.companyinfo}>
              {data?.contact_number_one || "-"},{" "}
              {data?.contact_number_two || "-"}
            </Text>
            <Text style={styles.companyinfo}>{data?.email || "-"}</Text>
            {data.website && (
              <Text style={styles.companyinfo}>{data?.website || "-"}</Text>
            )}
            {data.gst_number && (
              <Text style={styles.companyinfo}>
                GST : {data?.gst_number || "-"}
              </Text>
            )}
          </View>
        </View>

        {/* Move */}

        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.heading}>Move From</Text>
            <View style={styles.moveDetails}>
              <Text style={styles.moveText}>
                <Text style={styles.moveLabel}>Address: </Text>
                {data?.origin_address || "-"} {data?.origin_city || "-"},{" "}
                {data?.origin_state || "-"}, {data?.origin_country || "-"},{" "}
                {data?.origin_pincode || "-"}
              </Text>

              <Text style={styles.moveText}>
                <Text style={styles.moveLabel}>Floor: </Text>
                {data?.origin_floor || "-"}
              </Text>

              <Text style={styles.moveText}>
                <Text style={styles.moveLabel}>Lift Available: </Text>
                {data?.origin_lift_available || "-"}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <Text style={styles.heading}>Move To</Text>
            <View style={styles.moveDetails}>
              <Text style={styles.moveText}>
                <Text style={styles.moveLabel}>Address: </Text>
                {data?.desination_address} {data?.desination_city || "-"},{" "}
                {data?.desination_state || "-"},{" "}
                {data?.desination_country || "-"},{" "}
                {data?.desination_pincode || "-"}
              </Text>

              <Text style={styles.moveText}>
                <Text style={styles.moveLabel}>Floor: </Text>
                {data?.desination_floor || "-"}
              </Text>

              <Text style={styles.moveText}>
                <Text style={styles.moveLabel}>Lift Available: </Text>
                {data?.desination_lift_available || "-"}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment TABLE */}
        <View style={styles.paymentDetails}>
          <Text style={styles.paymentHeading}>Payment Details</Text>

          <View style={styles.paymentTable}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>Freight Charge</Text>
              <Text style={styles.tableCellRight}>
                {data?.freight_charge || "-"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>
                Packing Charge ({data.packing_charge_type})
              </Text>
              <Text style={styles.tableCellRight}>
                {data?.packing_charge || "-"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>
                Unpacking Charge ({data.unpacking_charge_type})
              </Text>
              <Text style={styles.tableCellRight}>
                {data?.unpacking_charge || "-"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>
                Loading Charge ({data.loading_charge_type})
              </Text>
              <Text style={styles.tableCellRight}>
                {data?.loading_charge || "-"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>
                Unloading Charge ({data.unloading_charge_type})
              </Text>
              <Text style={styles.tableCellRight}>
                {data?.unloading_charge || "-"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>Octroi Tax</Text>
              <Text style={styles.tableCellRight}>
                {data?.octroi_tax || "-"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>Car Transport</Text>
              <Text style={styles.tableCellRight}>{data?.car_tpt || "-"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>Packing Material</Text>
              <Text style={styles.tableCellRight}>
                {data?.packing_material_charge || "-"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>Other Charges</Text>
              <Text style={styles.tableCellRight}>
                {data?.other_charge || "-"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>Storage</Text>
              <Text style={styles.tableCellRight}>
                {data?.storage_charge || "-"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>Miscellaneous</Text>
              <Text style={styles.tableCellRight}>
                {data?.miscellaneous_charge || "-"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>ST Charge</Text>
              <Text style={styles.tableCellRight}>
                {data?.st_charge || "-"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>Discount</Text>
              <Text style={styles.tableCellRight}>{data?.discount || "-"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCellLeft, styles.tableData]}>
                Sub Total
              </Text>
              <Text style={[styles.tableCellRight, styles.tableData]}>
                {data?.sub_total || "-"}
              </Text>
            </View>
            {data.surcharge_type !== "Not Applicable" && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCellLeft}>
                  Surcharge ({data.surcharge_percent}%)
                </Text>
                <Text style={styles.tableCellRight}>
                  {data.surcharge_type === "Applicable"
                    ? surchargeAmount.toFixed(2)
                    : data.surcharge_type === "Extra"
                      ? "Extra"
                      : "-"}
                </Text>
              </View>
            )}

            {Number(data.gst_in_out) !== 3 && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCellLeft}>
                  {Number(data.gst_in_out) === 1 &&
                    `GST (${data.gst_percent}%)`}
                  {Number(data.gst_in_out) === 2 && `GST Excluded`}
                  {Number(data.gst_in_out) === 4 && `GST Exempted`}
                  {Number(data.gst_in_out) === 5 &&
                    `GST (${data.gst_percent}%)`}
                  {Number(data.gst_in_out) === 6 &&
                    `GST (${data.gst_percent}%) Included In Subtotal Amount`}
                </Text>
                <Text style={styles.tableCellRight}>
                  {/* ✅ CASE 1: CGST/SGST */}
                  {Number(data.gst_in_out) === 1 && data.gst_type === "1" && (
                    <View>
                      <Text>CGST: {Number(cgst).toFixed(2)}</Text>
                      <Text>SGST: {Number(sgst).toFixed(2)}</Text>
                    </View>
                  )}

                  {/* ✅ CASE 2: IGST */}
                  {Number(data.gst_in_out) === 1 && data.gst_type === "2" && (
                    <Text>IGST: {Number(totalGST).toFixed(2)}</Text>
                  )}

                  {/* बाकी conditions same */}
                  {Number(data.gst_in_out) === 2 &&
                    `GST (${data.gst_percent}%)`}
                  {Number(data.gst_in_out) === 4 && `GST (0%)`}
                  {Number(data.gst_in_out) === 5 && `Extra`}
                  {Number(data.gst_in_out) === 6 && `Included`}
                </Text>
              </View>
            )}
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>Insurance Charge</Text>
              <Text style={styles.tableCellRight}>
                {data.insurance_type === "Included in Freight"
                  ? "Included in Freight"
                  : data.insurance_type === "Show Insurance Amount"
                    ? insuranceAmount.toFixed(2)
                    : data.insurance_type === "Optional"
                      ? "Optional"
                      : data.insurance_type === "Extra"
                        ? "Extra"
                        : data.insurance_type === "Insurance Mandatory"
                          ? "Mandatory"
                          : "-"}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>
                Insurance GST ({data.ins_gst_percent}%)
              </Text>
              <Text style={styles.tableCellRight}>
                {data.insurance_type === "Included in Freight"
                  ? "0"
                  : data.insurance_type === "Show Insurance Amount"
                    ? insuranceGST.toFixed(2)
                    : data.insurance_type === "Optional"
                      ? "0"
                      : data.insurance_type === "Extra"
                        ? "0"
                        : data.insurance_type === "Insurance Mandatory"
                          ? "0"
                          : "-"}
              </Text>
            </View>
            {data.vehicle_insurance_type !== "Not Applicable" && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCellLeft}>Vehicle Ins. Charge</Text>
                <Text style={styles.tableCellRight}>
                  {data.vehicle_insurance_type === "Not Applicable"
                    ? "0"
                    : data.vehicle_insurance_type === "Additional from Freight"
                      ? vehicleInsuranceAmount.toFixed(2)
                      : data.vehicle_insurance_type === "Optional"
                        ? "Optional"
                        : data.vehicle_insurance_type === "Included in Freight"
                          ? "Included"
                          : "-"}
                </Text>
              </View>
            )}

            {data.vehicle_insurance_type === "Additional from Freight" && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCellLeft}>
                  Vehicle Ins. GST ({data.vehicle_ins_gst_percent}%)
                </Text>
                <Text style={styles.tableCellRight}>
                  {vehicleInsuranceGST.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.amountSection}>
          <View style={styles.signatureSection}>
            <View>
              {data.signature ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${data.signature}`}
                  style={{ width: 120, height: 60 }}
                />
              ) : (
                "-"
              )}
              <Text style={styles.bold}>Signature</Text>
            </View>

            <View>
              <Text style={styles.bold}>Authorized Sign</Text>
            </View>
          </View>

          {/* Amount Due Table */}
          <View style={styles.amountTable}>
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCellLeft,
                  styles.tableData,
                  styles.center,
                  { width: "100%", borderRightWidth: 0 },
                ]}
              >
                Amount Due
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>Total Amount</Text>
              <Text style={styles.tableCellRight}>
                {totalAmount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>Advance Paid</Text>
              <Text style={styles.tableCellRight}>
                {data?.advance_paid || "-"}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCellLeft, styles.tableData]}>
                Payable Amount
              </Text>
              <Text style={[styles.tableCellRight, styles.tableData]}>
                {payableAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View break>
          {/* SUMMARY */}

          <Text style={styles.remark}>
            <Text style={styles.bold}>Remark:</Text>
            {data?.qt_remark || "-"}
          </Text>

          <View style={styles.paymentTable}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                Is there easy access for loading & unloading at Location Move
                From & Move To:{" "}
                <Text style={styles.bold}>
                  {data?.easy_access_load_unload || "-"}
                </Text>
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                Should any items be got down through balcony etc.:{" "}
                <Text style={styles.bold}>
                  {data?.item_through_balcony || "-"}
                </Text>
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                Are there any restrictions for loading/unloading at Location
                Move From/Move To:{" "}
                <Text style={styles.bold}>{data?.any_restrictions || "-"}</Text>
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>
                Does you have any special needs or concerns:{" "}
                <Text style={styles.bold}>{data?.special_needs || "-"}</Text>
              </Text>
            </View>

            <View style={styles.tableRow}>
              {data.dec_val_of_vehicle > 0 && (
                <Text style={styles.tableCell}>
                  Vehicle insurance charge{" "}
                  {data?.vehicle_insurance_percent || "-"}% on declaration value
                  of vehicles{" "}
                  <Text style={styles.bold}>
                    {data?.dec_val_of_vehicle || "-"}
                  </Text>
                </Text>
              )}
            </View>
            <View style={styles.tableRow}>
              {data.dec_val_of_goods > 0 && (
                <Text style={styles.tableCell}>
                  Insurance charge {data?.insurance_percent || "-"}% on
                  declaration value of goods{" "}
                  <Text style={styles.bold}>
                    {data?.dec_val_of_goods || "-"}
                  </Text>
                </Text>
              )}
            </View>
          </View>

          {/* BANK */}

          <View style={styles.paymentDetails}>
            <Text style={styles.paymentHeading}>Bank / Payment Details</Text>

            <View style={styles.paymentTable}>
              <View style={styles.tableRow}>
                <Text style={styles.cellLabel}>Beneficiary Name</Text>
                <Text style={styles.cellValue}>
                  {data?.beneficiary_name || "-"}
                </Text>

                <Text style={styles.cellLabel}>Bank Name</Text>
                <Text style={[styles.cellValue, styles.lastCell]}>
                  {data?.bank_name || "-"}
                </Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cellLabel}>Account Number</Text>
                <Text style={styles.cellValue}>
                  {data?.account_number || "-"}
                </Text>

                <Text style={styles.cellLabel}>IFSC Code</Text>
                <Text style={[styles.cellValue, styles.lastCell]}>
                  {data?.ifsc || "-"}
                </Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cellLabel}>Branch</Text>
                <Text style={styles.cellValue}>{data?.branch || "-"}</Text>

                <Text style={styles.cellLabel}>PhonePe</Text>
                <Text style={[styles.cellValue, styles.lastCell]}>
                  {data?.phonepay || "-"}
                </Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cellLabel}>UPI ID 1</Text>
                <Text style={styles.cellValue}>{data?.upi_id_one || "-"}</Text>

                <Text style={styles.cellLabel}>UPI ID 2</Text>
                <Text style={[styles.cellValue, styles.lastCell]}>
                  {data?.upi_id_two || "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* ITEMS */}
          {data.items?.length > 0 && (
            <View style={styles.itemTable}>
              {/* Header */}
              <View style={styles.itemHeader}>
                <Text style={[styles.itemCell, styles.itemDescription]}>
                  Item
                </Text>

                <Text style={[styles.itemCell, styles.itemQty]}>Qty</Text>

                <Text style={[styles.itemCell, styles.itemValue]}>Value</Text>

                <Text style={[styles.itemCell, styles.itemRemark]}>Remark</Text>
              </View>

              {/* Body */}
              {data.items?.map((item, i) => (
                <View style={styles.itemRow}>
                  <Text style={[styles.itemCell, styles.itemDescription]}>
                    {item.description}
                  </Text>

                  <Text style={[styles.itemCell, styles.itemQty]}>
                    {item.quantity}
                  </Text>

                  <Text style={[styles.itemCell, styles.itemValue]}>
                    {item.value}
                  </Text>

                  <Text style={[styles.itemCell, styles.itemRemark]}>
                    {item.remark}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* TERMS */}

          <View style={styles.termsSection}>
            <Text style={styles.termsHeading}>Terms & Conditions</Text>

            {[
              "We are not responsible for cash, jewellery, or other valuable items.",
              "Advance payment is required before commencement of the move.",
              "Insurance of goods is recommended and will be charged separately if opted.",
              "Packing, loading, transportation, unloading, and unpacking will be carried out as per the agreed quotation.",
              "Any additional services or changes requested after confirmation will be charged extra.",
              "The company is not responsible for delays caused by natural disasters, traffic, strikes, government restrictions, or other unforeseen circumstances.",
              "Customers must ensure that all fragile and valuable items are properly declared before packing.",
              "Claims for loss or damage, if any, must be reported within 24 hours of delivery.",
              "Waiting charges may apply if loading or unloading is delayed due to customer-related reasons.",
              "The quotation is valid for 7 days from the date of issue unless otherwise specified.",
              "GST and other applicable taxes will be charged as per government regulations.",
            ].map((term, index) => (
              <View key={index} style={styles.termsItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.termsText}>{term}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
