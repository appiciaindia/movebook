import puppeteer from "puppeteer";
import { cookies } from "next/headers";
import Quotation from "@/models/quotation";

export async function GET(request) {
  const pathname = request.nextUrl.pathname;
  const id = pathname.split("/").pop();
  let browser;

  const data = await Quotation.findById(id);
  const quotationNo = data?.quotation_number || "Quotation";
  try {
    // Current logged-in user ki cookies
    const cookieStore = await cookies();

    const authUser = cookieStore.get("auth_user")?.value;
    const authSession = cookieStore.get("auth_session")?.value;

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Puppeteer browser me cookies set karo
    const browserCookies = [];

    if (authUser) {
      browserCookies.push({
        name: "auth_user",
        value: authUser,
        domain: "localhost", // Production me apna domain likhna
        path: "/",
      });
    }

    if (authSession) {
      browserCookies.push({
        name: "auth_session",
        value: authSession,
        domain: "localhost",
        path: "/",
      });
    }

    if (browserCookies.length) {
      await page.setCookie(...browserCookies);
    }

    // Invoice page open
    await page.goto(`http://localhost:3000/invoice/${id}`, {
      waitUntil: "networkidle0",
    });

    // Element load hone ka wait
    await page.waitForSelector("#pdf-content");

    const element = await page.$("#pdf-content");

    // Sirf isi element ki PDF ke liye baaki page hide
    await page.evaluate(() => {
      document.body.innerHTML =
        document.getElementById("pdf-content").outerHTML;
    });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "2mm",
        right: "2mm",
        bottom: "2mm",
        left: "2mm",
      },
    });

    await browser.close();

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Quotation-${quotationNo}.pdf"`,
      },
    });
  } catch (err) {
    if (browser) await browser.close();

    return Response.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 },
    );
  }
}
