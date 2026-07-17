import { pdf } from "@react-pdf/renderer";
import Quotation from "../../../../component/quotation/quotation";

export async function GET(req, { params }) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invoice/${id}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  const buffer = await pdf(
    <Quotation data={data} />
  ).toBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="quotation-${id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}