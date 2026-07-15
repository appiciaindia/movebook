
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
    <div id="pdf-content" className="container my-4 p-2 bg-white text-dark"
     style={{
        "--theme-color": data?.theme_color || "#000671",
      }}
    >
      {/* 🔷 Header */}
      <div className="d-flex justify-content-between align-items-center border p-2">
        {/* Logo */}
        <div>
          <img
            src={data.company_logo}
            alt="logo"
            style={{ maxHeight: "80px" }}
          />
        </div>

        {/* Company Info */}
        <div className="w-50 text-end">
          <h5 className="fw-bold text-dark mb-1">{data.company_name}</h5>
          <small>
            {data.address} <br />
            <strong>Mobile Number : </strong>
            {data.contact_number_one}, {data.contact_number_two} <br />
            <strong> Email :</strong>
            {data.email}
            {data.website && (
              <p>
                <strong>Website :</strong> {data.website}
              </p>
            )}
            {data.gst_number && (
              <p>
                <strong>GST Number :</strong> {data.gst_number}
              </p>
            )}
          </small>
        </div>
      </div>

      {/* 🔷 Title */}
      <h4 className="text-center fw-bold   py-2">QUOTATION</h4>

      {/* 🔷 Customer Info */}
      <div className="row my-2">
        <div className="col-6">
          <p className="mb-0">
            <b>Company:</b> {data.quotation_company_name}
          </p>
          <p className="mb-0">
            <b>Name:</b> {data.party_name}
          </p>
          <p className="mb-0">
            <b>Mobile:</b> {data.quotation_mobile}
          </p>
          <p className="mb-0">
            <b>Email:</b> {data.quotation_email}
          </p>
        </div>

        <div className="col-6 text-end">
          <p className="mb-0">
            <b>Quotation No:</b> {data.quotation_number}
          </p>
          <p className="mb-0">
            <b>Date:</b> {data.quotation_date}
          </p>
          <p className="mb-0">
            <b>Packing Date:</b> {data.packing_date}
          </p>
          <p className="mb-0">
            <b>Moving Date:</b> {data.moving_date}
          </p>
        </div>
      </div>

      {/* 🔷 Move Details */}
      <div className="row border p-2 m-0">
        <div className="col-6">
          <div className="">
            <h6 className="fw-bold">Move From</h6>
            <b>Address:</b> {data.origin_address} {data.origin_city},{" "}
            {data.origin_state}, {data.origin_country}, {data.origin_pincode}
            <br />
            <b>Floor:</b> {data.origin_floor}
            <br />
            <b>Lift Avilable:</b> {data.origin_lift_available}
          </div>
        </div>

        <div className="col-6">
          <div className="">
            <h6 className="fw-bold">Move To</h6>
            <b>Address:</b> {data.desination_address} {data.desination_city},{" "}
            {data.desination_state}, {data.desination_country},{" "}
            {data.desination_pincode}
            <br />
            <b>Floor:</b> {data.desination_floor}
            <br />
            <b>Lift Avilable:</b> {data.desination_lift_available}
          </div>
        </div>
      </div>

      {/* 🔷 Payment Details */}
      <div className="mt-2">
        <h5 className="fw-bold">Payment Details</h5>

        <table className="table table-bordered mt-2 mb-0">
          <tbody>
            <tr>
              <td>Freight Charge</td>
              <td>{data.freight_charge}</td>
              <td>Octroi Tax</td>
              <td>{data.octroi_tax}</td>
            </tr>

            <tr>
              <td>Packing Charge ({data.packing_charge_type})</td>
              <td>{data.packing_charge}</td>
              <td>Car Transport</td>
              <td>{data.car_tpt}</td>
            </tr>

            <tr>
              <td>Unpacking Charge ({data.unpacking_charge_type})</td>
              <td>{data.unpacking_charge}</td>
              <td>Packing Material</td>
              <td>{data.packing_material_charge}</td>
            </tr>

            <tr>
              <td>Unloading Charge ({data.unloading_charge_type})</td>
              <td>{data.unloading_charge}</td>
              <td>Other Charges</td>
              <td>{data.other_charge}</td>
            </tr>

            <tr>
              <td>Loading Charge ({data.loading_charge_type})</td>
              <td>{data.loading_charge}</td>
              <td>Storage</td>
              <td>{data.storage_charge}</td>
            </tr>

            <tr>
              <td>Miscellaneous</td>
              <td>{data.miscellaneous_charge}</td>
              <td>ST Charge</td>
              <td>{data.st_charge}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="row justify-content-end">
        <div className="col-6 m-0">
         <table className="table table-bordered m-0">
            <tbody>
              <tr>
               

                <td className="bg-dark text-white">Sub Total</td>
                <td>{data.sub_total}</td>
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
                  {/* ✅ CASE 1: CGST/SGST */}
                  {Number(data.gst_in_out) === 1 && data.gst_type === "1" && (
                    <div>
                      <small>CGST: {cgst.toFixed(2)}</small> <br />
                      <small>SGST: {sgst.toFixed(2)}</small>
                    </div>
                  )}

                  {/* ✅ CASE 2: IGST */}
                  {Number(data.gst_in_out) === 1 && data.gst_type === "2" && (
                    <div>{totalGST.toFixed(2)}</div>
                  )}

                  {/* बाकी conditions same */}
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
              <tr>
               
                <td>Discount</td>
                <td>{data.discount}</td>
              </tr>
              <tr>
              
                <td className="bg-dark text-white">Total Amount</td>
                <td className="bg-dark text-white">{totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                
                <td>Advance Paid</td>
                <td>{data.advance_paid}</td>
              </tr>

              <tr>
               
                <td className="bg-dark text-white">Payable Amount</td>
                <td className="bg-dark text-white">
                  {payableAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* 👇 FORCE NEXT PAGE */}
      <div style={{ pageBreakAfter: "always" }}></div>
      <p className="mt-4">
        <b>Remark:</b> {data.qt_remark}
      </p>
      <table className="table table-bordered mb-4">
        <tbody>
          <tr>
            <td>
              Is there easy access for loading & unloading at Location Move From
              & Move To: <b>{data.easy_access_load_unload || "-"}</b>
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
              Are there any restrictions for loading/unloading at Location Move
              From/Move To: <b>{data.any_restrictions || "-"}</b>
            </td>
          </tr>

          <tr>
            <td>
              Does you have any special needs or concerns:{" "}
              <b>{data.special_needs || "-"}</b>
            </td>
          </tr>

          <tr>
            <td>
              {data.dec_val_of_vehicle > 0 && (
                <div>
                  Vehicle insurance charge @
                  {data.vehicle_insurance_percent || "-"} on declaration value
                  of vehicles <b>{data.dec_val_of_vehicle}</b>
                </div>
              )}
              <div>
                Insurance charge {data.insurance_percent || "-"}% on declaration
                value of goods <b>{data.dec_val_of_goods || "-"}</b>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered mb-4">
        <thead>
          <tr>
            <th colSpan="4" className="text-center">
              Bank / Payment Details
            </th>
          </tr>
        </thead>

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

          {/* Signature Row */}
          <tr>
            <td colSpan="2">
              <b>Signature</b>
              <br />
              {data.signature ? (
                <img src={data.signature} style={{ height: "60px" }} />
              ) : (
                "-"
              )}
            </td>

            <td colSpan="2" className="text-center align-middle">
              <b>Authorized Sign</b>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 🔷 Items */}
      <table className="table table-bordered mt-4">
        <thead className="table-light">
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Value</th>
            <th>Remark</th>
          </tr>
        </thead>

        <tbody>
          {data.items?.map((item, i) => (
            <tr key={i}>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.value}</td>
              <td>{item.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔷 Footer */}
      <div className="mt-4">
        <h6 className="fw-bold">Terms & Conditions</h6>
        <ul style={{ fontSize: "12px" }}>
          <li>We are not responsible for cash/jewellery.</li>
          <li>Advance payment required.</li>
          <li>Insurance recommended.</li>
        </ul>
      </div>
    </div>
  );
}
