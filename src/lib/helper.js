import Quotation from "@/models/quotation";

export const generateQuotationNumber = async (QuotationModel, userId) => {
  const year = new Date().getFullYear();

  const query = {
    quotation_number: { $regex: `^Q-${year}-` },
  };

  if (userId) {
    query.userId = userId;
  }

  const lastQuotation = await QuotationModel.findOne(query).sort({ quotation_number: -1 });

  let nextNumber = 1;

  if (lastQuotation?.quotation_number) {
    const lastNumber = parseInt(
      lastQuotation.quotation_number.split("-")[2]
    );

    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  return `Q-${year}-${String(nextNumber).padStart(4, "0")}`;
};