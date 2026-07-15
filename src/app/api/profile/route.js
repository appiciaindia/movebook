import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Profile from "@/models/Profile";
import fs from "fs";
import path from "path";
import sharp from "sharp";

async function getThemeColor(imagePath) {
  try {
    const { data, info } = await sharp(imagePath)
      .resize(250, 250, { fit: "inside" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const colorMap = new Map();

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Transparent pixels ignore
      if (a < 20) continue;

      // White / Near White ignore
      if (r > 240 && g > 240 && b > 240) continue;

      // Black / Near Black ignore (optional)
      if (r < 15 && g < 15 && b < 15) continue;

      // Similar colors ko group karne ke liye
      const rr = Math.round(r / 10) * 10;
      const gg = Math.round(g / 10) * 10;
      const bb = Math.round(b / 10) * 10;

      const key = `${rr},${gg},${bb}`;

      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }

    let dominant = "#000671";
    let max = 0;

    for (const [key, count] of colorMap.entries()) {
      if (count > max) {
        max = count;

        const [r, g, b] = key.split(",").map(Number);

        dominant =
          "#" +
          [r, g, b]
            .map((v) => v.toString(16).padStart(2, "0"))
            .join("");
      }
    }

    return dominant;
  } catch (err) {
    console.error(err);
    return "#000671";
  }
}

function requireUserId(url) {
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return null;
  }

  return userId;
}

function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) {
    return null;
  }

  const cookie = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.substring(name.length + 1));
}

function resolveUserId(req, formData, url) {
  const queryUserId = requireUserId(url);
  const formUserId = formData?.get?.("userId");
  const cookieUserId = getCookieValue(req.headers.get("cookie") || "", "auth_user");

  const resolvedValue = [formUserId, queryUserId, cookieUserId].find((value) => {
    return typeof value === "string" && value.trim().length > 0;
  });

  return resolvedValue ? resolvedValue.toString().trim() : null;
}

const requiredRegistrationFields = [
  ["full_name", "Full Name"],
  ["company_name", "Company Name"],
  ["email", "Email"],
  ["contact_number_one", "Business Phone 1"],
  ["pan_number", "PAN"],
  ["address", "Address"],
];

const requiredRegistrationFiles = [
  ["company_logo", "Company Logo"],
  ["pan_card", "PAN Card"],
];

const fieldLabels = new Map([
  ...requiredRegistrationFields,
  ["contact_number_two", "Business Phone 2"],
  ["website", "Website"],
  ["gst_number", "GSTIN"],
  ["ifsc", "IFSC Code"],
  ["account_number", "Account Number"],
  ["upi_id_one", "UPI ID 1"],
  ["upi_id_two", "UPI ID 2"],
  ["phonepay", "PhonePe Number"],
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{7,15}$/;
const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const accountPattern = /^[0-9]{6,18}$/;
const upiPattern = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasFile(value) {
  return value && typeof value !== "string" && value.size > 0;
}

function safeUploadName(fileName) {
  return `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
}

function validateRegistration(data, body) {
  const isRegisterSubmit = requiredRegistrationFiles.some(([key]) =>
    data.has(key)
  );

  if (!isRegisterSubmit) {
    return [];
  }

  const missingFields = requiredRegistrationFields
    .filter(([key]) => !hasValue(body[key]))
    .map(([, label]) => label);

  const missingFiles = requiredRegistrationFiles
    .filter(([key]) => !hasFile(data.get(key)))
    .map(([, label]) => label);

  return [...missingFields, ...missingFiles];
}

function normalizeBody(body) {
  Object.keys(body).forEach((key) => {
    if (typeof body[key] === "string") {
      body[key] = body[key].trim();
    }
  });

  if (body.email) {
    body.email = body.email.toLowerCase();
  }

  if (body.pan_number) {
    body.pan_number = body.pan_number.toUpperCase();
  }

  if (body.gst_number) {
    body.gst_number = body.gst_number.toUpperCase();
  }

  if (body.ifsc) {
    body.ifsc = body.ifsc.toUpperCase();
  }
}

function validateProfileFields(body, requiredFields = requiredRegistrationFields) {
  const errors = [];

  requiredFields.forEach(([key, label]) => {
    if (!hasValue(body[key])) {
      errors.push(`${label} is required`);
    }
  });

  if (hasValue(body.email) && !emailPattern.test(body.email)) {
    errors.push("Enter a valid Email");
  }

  ["contact_number_one", "contact_number_two", "phonepay"].forEach((key) => {
    if (hasValue(body[key]) && !phonePattern.test(body[key])) {
      errors.push(`Enter a valid ${fieldLabels.get(key)}`);
    }
  });

  if (hasValue(body.website)) {
    try {
      new URL(body.website);
    } catch {
      errors.push("Enter a valid Website URL");
    }
  }

  if (hasValue(body.pan_number) && !panPattern.test(body.pan_number)) {
    errors.push("Enter a valid PAN");
  }

  if (hasValue(body.gst_number) && !gstPattern.test(body.gst_number)) {
    errors.push("Enter a valid GSTIN");
  }

  if (hasValue(body.ifsc) && !ifscPattern.test(body.ifsc)) {
    errors.push("Enter a valid IFSC Code");
  }

  if (hasValue(body.account_number) && !accountPattern.test(body.account_number)) {
    errors.push("Enter a valid Account Number");
  }

  ["upi_id_one", "upi_id_two"].forEach((key) => {
    if (hasValue(body[key]) && !upiPattern.test(body[key])) {
      errors.push(`Enter a valid ${fieldLabels.get(key)}`);
    }
  });

  return errors;
}

function validationResponse(errors) {
  return NextResponse.json(
    {
      success: false,
      message: errors.join(", "),
    },
    { status: 400 }
  );
}

async function saveUpload(file, uploadDir) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uniqueName = safeUploadName(file.name);
  const filePath = path.join(uploadDir, uniqueName);

  fs.writeFileSync(filePath, buffer);

  return `/uploads/${uniqueName}`;
}

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const userId = resolveUserId(req, null, url);

    let data;

    if (userId) {
      data = await Profile.findOne({ userId });
    } else if (email) {
      data = await Profile.findOne({ email: email.toLowerCase() });
    } else {
      data = await Profile.findOne().sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.formData();
    const body = {};

    data.forEach((value, key) => {
      body[key] = value;
    });

    normalizeBody(body);

    const missingFields = validateRegistration(data, body);

    if (missingFields.length > 0) {
      return validationResponse(
        missingFields.map((field) => `${field} is required`)
      );
    }

    const validationErrors = validateProfileFields(body);

    if (validationErrors.length > 0) {
      return validationResponse(validationErrors);
    }

    const logoFile = data.get("company_logo");
    const panCardFile = data.get("pan_card");
    const signFile = data.get("signature");

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

   if (hasFile(logoFile)) {
  body.company_logo = await saveUpload(logoFile, uploadDir);

  const logoPath = path.join(
    process.cwd(),
    "public",
    body.company_logo
  );

  body.theme_color = await getThemeColor(logoPath);
}

    if (hasFile(panCardFile)) {
      body.pan_card = await saveUpload(panCardFile, uploadDir);
    }

    if (hasFile(signFile)) {
      body.signature = await saveUpload(signFile, uploadDir);
    }

    const url = new URL(req.url);
    const userId = resolveUserId(req, data, url);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    body.userId = userId;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { $set: body },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        strict: false,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Profile saved successfully",
      data: updatedProfile,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const data = await req.formData();
    const body = {};

    data.forEach((value, key) => {
      body[key] = value;
    });

    normalizeBody(body);

    const validationErrors = validateProfileFields(body);

    if (validationErrors.length > 0) {
      return validationResponse(validationErrors);
    }

    const logoFile = data.get("company_logo");
    const panCardFile = data.get("pan_card");
    const signFile = data.get("signature");

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

 if (hasFile(logoFile)) {
  body.company_logo = await saveUpload(logoFile, uploadDir);

  const logoPath = path.join(
    process.cwd(),
    "public",
    body.company_logo
  );

  body.theme_color = await getThemeColor(logoPath);
}

    if (hasFile(panCardFile)) {
      body.pan_card = await saveUpload(panCardFile, uploadDir);
    }

    if (hasFile(signFile)) {
      body.signature = await saveUpload(signFile, uploadDir);
    }

    const url = new URL(req.url);
    const userId = resolveUserId(req, data, url);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    body.userId = userId;

    const updated = await Profile.findOneAndUpdate(
      { userId },
      { $set: body },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        strict: false,
      }
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
