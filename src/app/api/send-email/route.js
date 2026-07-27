import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { to, quotationId } = await req.json();

    // PDF fetch karo
    const pdfResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/pdf/${quotationId}`
    );

    if (!pdfResponse.ok) {
      throw new Error("Failed to generate PDF");
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // 465 ho to true
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"MoveBook" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: "Quotation",
      html: `
        <p>Dear Customer,</p>
        <p>Please find your quotation attached.</p>
        <p>Thank you.</p>
      `,
      attachments: [
        {
          filename: `Quotation-${quotationId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return Response.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}