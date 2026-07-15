import styles from "./style.module.css";
async function getInvoice(id) {
  const res = await fetch(`http://localhost:3000/api/invoice/${id}`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function InvoicePage({ params }) {
  const { id } = await params;

  const data = await getInvoice(id);

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
    <div
      id="pdf-content"
      className="container my-4"
      style={{
        "--theme-color": data?.theme_color || "#000671",
      }}
    >
      <div className={styles.pages}>
        {/* 🔷 Header */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <div className={styles.quationDate}>
              <h4>
                <span>Quotation No:</span> {data.quotation_number}
              </h4>

              <p>
                <span>Date:</span> {data.quotation_date}
              </p>
              <p>
                <span>Packing Date:</span> {data.packing_date}
              </p>
              <p>
                <span>Moving Date:</span> {data.moving_date}
              </p>
            </div>

            <div className={styles.clientDetails}>
              <p>
                <span>Company Name:</span> {data.quotation_company_name}
              </p>
              <p>
                <span>Customer Name:</span> {data.party_name}
              </p>
              <p>
                <span>Mobile:</span> {data.quotation_mobile}
              </p>
              <p>
                <span>Email:</span> {data.quotation_email}
              </p>
            </div>
          </div>

          <div className="text-end">
            {/* Logo */}
            <div>
              <img
                src={data.company_logo}
                alt="logo"
                style={{ maxHeight: "80px" }}
              />
            </div>

            {/* Company Info */}
            <div className={styles.company_info}>
              <h5>{data.company_name}</h5>
              <p>{data.address} </p>
              <p>
                {data.contact_number_one}, {data.contact_number_two}
              </p>
              <p> {data.email} </p>
              {data.website && <p>{data.website}</p>}
              {data.gst_number && <p>{data.gst_number}</p>}
            </div>
          </div>
        </div>

        {/* 🔷 Move Details */}
        <div className="row my-2">
          <div className="col-6">
            <div className={styles.moveDetails}>
              <h6>Move From</h6>
              <p>
                <span>Address: </span>
                {data.origin_address} {data.origin_city}, {data.origin_state},{" "}
                {data.origin_country}, {data.origin_pincode}{" "}
              </p>

              <p>
                <span>Floor: </span>
                {data.origin_floor}{" "}
              </p>

              <p>
                <span>Lift Avilable: </span>
                {data.origin_lift_available}{" "}
              </p>
            </div>
          </div>

          <div className="col-6">
            <div className={styles.moveDetails}>
              <h6>Move To</h6>
              <p>
                <span>Address: </span>
                {data.desination_address} {data.desination_city},{" "}
                {data.desination_state}, {data.desination_country},{" "}
                {data.desination_pincode}{" "}
              </p>

              <p>
                <span>Floor: </span>
                {data.desination_floor}{" "}
              </p>

              <p>
                <span>Lift Avilable: </span>
                {data.desination_lift_available}{" "}
              </p>
            </div>
          </div>
        </div>

        {/* 🔷 Payment Details */}
        <div className={styles.paymentDetails}>
          <h6>Payment Details</h6>

          <table className={`table table-bordered my-0 ${styles.paymentTable}`}>
            <tbody>
              <tr>
                <td>Freight Charge</td>
                <td>{data.freight_charge}</td>
              </tr>

              <tr>
                <td>Packing Charge ({data.packing_charge_type})</td>
                <td>{data.packing_charge}</td>
              </tr>

              <tr>
                <td>Unpacking Charge ({data.unpacking_charge_type})</td>
                <td>{data.unpacking_charge}</td>
              </tr>
              <tr>
                <td>Loading Charge ({data.loading_charge_type})</td>
                <td>{data.loading_charge}</td>
              </tr>
              <tr>
                <td>Unloading Charge ({data.unloading_charge_type})</td>
                <td>{data.unloading_charge}</td>
              </tr>
              <tr>
                <td>Octroi Tax</td>
                <td>{data.octroi_tax}</td>
              </tr>

              <tr>
                <td>Car Transport</td>
                <td>{data.car_tpt}</td>
              </tr>

              <tr>
                <td>Packing Material</td>
                <td>{data.packing_material_charge}</td>
              </tr>

              <tr>
                <td>Other Charges</td>
                <td>{data.other_charge}</td>
              </tr>

              <tr>
                <td>Storage</td>
                <td>{data.storage_charge}</td>
              </tr>

              <tr>
                <td>Miscellaneous</td>
                <td>{data.miscellaneous_charge}</td>
              </tr>
              <tr>
                <td>ST Charge</td>
                <td>{data.st_charge}</td>
              </tr>
              <tr>
                <td>Discount</td>
                <td>{data.discount}</td>
              </tr>
              <tr>
                <td className={styles.tableData}>Sub Total</td>
                <td className={styles.tableData}>{data.sub_total}</td>
              </tr>
              <tr>
                {data.surcharge_type !== "Not Applicable" && (
                  <>
                    <td>Surcharge ({data.surcharge_percent}%)</td>
                    <td>
                      {data.surcharge_type === "Applicable"
                        ? surchargeAmount.toFixed(2)
                        : data.surcharge_type === "Extra"
                          ? "Extra"
                          : "-"}
                    </td>
                  </>
                )}
              </tr>
              <tr>
                {Number(data.gst_in_out) !== 3 && (
                  <td>
                    {Number(data.gst_in_out) === 1 &&
                      `GST (${data.gst_percent}%)`}
                    {Number(data.gst_in_out) === 2 && `GST Excluded`}
                    {Number(data.gst_in_out) === 4 && `GST Exempted`}
                    {Number(data.gst_in_out) === 5 &&
                      `GST (${data.gst_percent}%)`}
                    {Number(data.gst_in_out) === 6 &&
                      `GST (${data.gst_percent}%) Included In Subtotal Amount`}
                  </td>
                )}

                <td>
                  {Number(data.gst_in_out) === 1 && data.gst_type === "1" && (
                    <div>
                      <small>CGST: {cgst.toFixed(2)}</small> <br />
                      <small>SGST: {sgst.toFixed(2)}</small>
                    </div>
                  )}

                  {Number(data.gst_in_out) === 1 && data.gst_type === "2" && (
                    <div>{totalGST.toFixed(2)}</div>
                  )}

                  {Number(data.gst_in_out) === 2 &&
                    `GST (${data.gst_percent}%)`}
                  {Number(data.gst_in_out) === 4 && `GST (0%)`}
                  {Number(data.gst_in_out) === 5 && `Extra`}
                  {Number(data.gst_in_out) === 6 && `Included`}
                </td>
              </tr>
              <tr>
                <td>Insurance Charge</td>
                <td>
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
                </td>
              </tr>

              <tr>
                <td>Insurance GST ({data.ins_gst_percent}%)</td>
                <td>
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
                </td>
              </tr>

              <tr>
                {data.vehicle_insurance_type !== "Not Applicable" && (
                  <>
                    <td>Vehicle Ins. Charge</td>
                    <td>
                      {data.vehicle_insurance_type === "Not Applicable"
                        ? "0"
                        : data.vehicle_insurance_type ===
                            "Additional from Freight"
                          ? vehicleInsuranceAmount.toFixed(2)
                          : data.vehicle_insurance_type === "Optional"
                            ? "Optional"
                            : data.vehicle_insurance_type ===
                                "Included in Freight"
                              ? "Included"
                              : "-"}
                    </td>
                  </>
                )}
              </tr>
              <tr>
                {data.vehicle_insurance_type === "Additional from Freight" && (
                  <>
                    <td>Vehicle Ins. GST({data.vehicle_ins_gst_percent}%)</td>
                    <td>{vehicleInsuranceGST.toFixed(2)}</td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row mt-4  align-items-end">
          <div className="col-8">
            <div className="d-flex justify-content-between align-items-end">
              {/* Signature Row */}
              <div>
                {data.signature ? (
                  <img src={data.signature} style={{ height: "60px" }} />
                ) : (
                  "-"
                )}{" "}
                <br />
                <b>Signature</b>
              </div>

              <div className="text-center align-middle">
                <b>Authorized Sign</b>
              </div>
            </div>
          </div>
          <div className="col-4">
            <table className={`table table-bordered ${styles.paymentTable}`}>
              <tbody>
                <tr>
                  <td className={`text-center ${styles.tableData}`} colSpan={2}>
                    Amount Due
                  </td>
                </tr>

                <tr>
                  <td>Total Amount</td>
                  <td>{totalAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Advance Paid</td>
                  <td>{data.advance_paid}</td>
                </tr>

                <tr>
                  <td className={styles.tableData}>Payable Amount</td>
                  <td className={styles.tableData}>
                    {payableAmount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={`mt-4 ${styles.pages}`}>
        <p>
          <b>Remark:</b> {data.qt_remark}
        </p>
        <table className={`table table-bordered my-0 ${styles.paymentTable}`}>
          <tbody>
            <tr>
              <td>
                Is there easy access for loading & unloading at Location Move
                From & Move To: <b>{data.easy_access_load_unload || "-"}</b>
              </td>
            </tr>

            <tr>
              <td>
                Should any items be got down through balcony etc.:{" "}
                <b>{data.item_through_balcony || "-"}</b>
              </td>
            </tr>

            <tr>
              <td>
                Are there any restrictions for loading/unloading at Location
                Move From/Move To: <b>{data.any_restrictions || "-"}</b>
              </td>
            </tr>

            <tr>
              <td>
                Does you have any special needs or concerns:{" "}
                <b>{data.special_needs || "-"}</b>
              </td>
            </tr>

            {(Number(data.vehicle_insurance_percent) > 0 ||
              Number(data.insurance_percent) > 0) && (
              <tr>
                <td>
                  {Number(data.vehicle_insurance_percent) > 0 && (
                    <div>
                      Vehicle insurance charge @{data.vehicle_insurance_percent}
                      % on declaration value of vehicles{" "}
                      <b>{data.dec_val_of_vehicle}</b>
                    </div>
                  )}

                  {Number(data.insurance_percent) > 0 && (
                    <div>
                      Insurance charge {data.insurance_percent}% on declaration
                      value of goods <b>{data.dec_val_of_goods}</b>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={`mt-4 ${styles.paymentDetails}`}>
          <h6>Bank / Payment Details</h6>
          <table className={`table table-bordered my-0 ${styles.paymentTable}`}>
            <tbody>
              <tr>
                <td>
                  <b>Beneficiary Name</b>
                </td>
                <td>{data.beneficiary_name || "-"}</td>

                <td>
                  <b>Bank Name</b>
                </td>
                <td>{data.bank_name || "-"}</td>
              </tr>

              <tr>
                <td>
                  <b>Account Number</b>
                </td>
                <td>{data.account_number || "-"}</td>

                <td>
                  <b>IFSC Code</b>
                </td>
                <td>{data.ifsc || "-"}</td>
              </tr>

              <tr>
                <td>
                  <b>Branch</b>
                </td>
                <td>{data.branch || "-"}</td>

                <td>
                  <b>PhonePe</b>
                </td>
                <td>{data.phonepay || "-"}</td>
              </tr>

              <tr>
                <td>
                  <b>UPI ID 1</b>
                </td>
                <td>{data.upi_id_one || "-"}</td>

                <td>
                  <b>UPI ID 2</b>
                </td>
                <td>{data.upi_id_two || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 🔷 Items */}
        {data.items?.length > 0 && (
          <table className={`table table-bordered mt-4 ${styles.paymentTable}`}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Value</th>
                <th>Remark</th>
              </tr>
            </thead>

            <tbody>
              {data.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{item.value}</td>
                  <td>{item.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 🔷 Footer */}
        <div className="mt-4">
          <h6 className="fw-bold">Terms & Conditions</h6>
          <ul style={{ fontSize: "12px" }}>
            <li>
              We are not responsible for cash, jewellery, or other valuable
              items.
            </li>
            <li>
              Advance payment is required before commencement of the move.
            </li>
            <li>
              Insurance of goods is recommended and will be charged separately
              if opted.
            </li>
            <li>
              Packing, loading, transportation, unloading, and unpacking will be
              carried out as per the agreed quotation.
            </li>
            <li>
              Any additional services or changes requested after confirmation
              will be charged extra.
            </li>
            <li>
              The company is not responsible for delays caused by natural
              disasters, traffic, strikes, government restrictions, or other
              unforeseen circumstances.
            </li>
            <li>
              Customers must ensure that all fragile and valuable items are
              properly declared before packing.
            </li>
            <li>
              Claims for loss or damage, if any, must be reported within 24
              hours of delivery.
            </li>
            <li>
              Waiting charges may apply if loading or unloading is delayed due
              to customer-related reasons.
            </li>
            <li>
              The quotation is valid for 7 days from the date of issue unless
              otherwise specified.
            </li>
            <li>
              GST and other applicable taxes will be charged as per government
              regulations.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
