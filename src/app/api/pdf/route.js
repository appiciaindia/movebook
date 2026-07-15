import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "../../(public)/invoice/InvoicePDF";

export async function GET() {
  const buffer = await pdf(<InvoicePDF />).toBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}