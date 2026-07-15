import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";

export default function Page() {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <InvoicePDF />
    </PDFViewer>
  );
}