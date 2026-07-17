
import { PDFViewer } from "@react-pdf/renderer";
import Quotation from "../../../../component/quotation/quotation";
async function getInvoice(id) {
  const res = await fetch(`http://localhost:3000/api/invoice/${id}`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function Page({params}) {
 const { id } = await params;

  const data = await getInvoice(id);

  // const subTotal = Number(data.sub_total || 0);

  // const surchargePercent = Number(data.surcharge_percent || 0);
  // const surchargeAmount = (subTotal * surchargePercent) / 100;

  // const insuranceAmount =
  //   ((data.dec_val_of_goods || 0) * (data.insurance_percent || 0)) / 100;

  // const insuranceGST = (insuranceAmount * (data.ins_gst_percent || 0)) / 100;

  // const vehicleInsuranceAmount =
  //   ((data.dec_val_of_vehicle || 0) * (data.vehicle_insurance_percent || 0)) /
  //   100;

  // const vehicleInsuranceGST =
  //   (vehicleInsuranceAmount * (data.vehicle_ins_gst_percent || 0)) / 100;

  // const gstPercent = Number(data.gst_percent || 0);

  // const totalGST = (subTotal * gstPercent) / 100;
  // const cgst = totalGST / 2;
  // const sgst = totalGST / 2;

  // const totalAmount =
  //   (subTotal || 0) +
  //   (surchargeAmount || 0) +
  //   (totalGST || 0) +
  //   (insuranceAmount || 0) +
  //   (insuranceGST || 0) +
  //   (vehicleInsuranceAmount || 0) +
  //   (vehicleInsuranceGST || 0);

  // const advancePaid = Number(data.advance_paid || 0);
  // const payableAmount = totalAmount - advancePaid;


  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Quotation data={data} />
    </PDFViewer>
  );
}