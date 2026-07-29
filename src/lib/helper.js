import Counter from "@/models/Counter";

/**
 * Preview Number
 * Counter increment nahi karega.
 * Sirf Add Quotation page me dikhane ke liye.
 */
export const getQuotationPreviewNumber = async (userId) => {
  const year = new Date().getFullYear();

  const counterId = `quotation_${userId}_${year}`;

  const counter = await Counter.findById(counterId);

  const nextNumber = (counter?.seq || 0) + 1;

  return `Q-${year}-${String(nextNumber).padStart(4, "0")}`;
};

/**
 * Final Number
 * Save ke time call karna.
 * Atomic Increment karega.
 */
export const generateQuotationNumber = async (userId) => {
  const year = new Date().getFullYear();

  const counterId = `quotation_${userId}_${year}`;

  const counter = await Counter.findOneAndUpdate(
    {
      _id: counterId,
    },
    {
      $inc: {
        seq: 1,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return `Q-${year}-${String(counter.seq).padStart(4, "0")}`;
};