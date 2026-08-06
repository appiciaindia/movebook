import cloudinary from "@/lib/cloudinary";

export async function uploadToCloudinary(file, folder = "MoveBook") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);

          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            buffer, // <-- return buffer bhi
          });
        }
      )
      .end(buffer);
  });
}