import { Request, Response } from "express";
import PaymentHistory from "../../../models/paymentHistory";
import SelectedScheme from "../../../models/selectedScheme";

export const selectedSchemesList = async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    
  // Step 1: Find selected schemes for the user
  const selectedSchemes = await SelectedScheme.find({ user_id: userId })
    .select("_id scheme_id balance_payout payment_date")
    .populate({
      path: "scheme_id",
      select: "name months monthly_pay amount bonus",
      model: "Scheme",
    });

  // Extract selected scheme IDs
  const selectedSchemeIds = selectedSchemes.map((scheme) => scheme._id);

  // Step 2: Find payment histories for these selected schemes
  const paymentHistories = await PaymentHistory.find({
    user_id: userId,
    selected_scheme_id: { $in: selectedSchemeIds },
  }).select("user_id paid_amount paidAt selected_scheme_id");

  // Step 3: Combine payment histories with their corresponding selected schemes
  const paymentHistoryMap = paymentHistories.reduce(
    (acc, payment) => {
      const key = payment.selected_scheme_id.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(payment);
      return acc;
    },
    {} as Record<string, typeof paymentHistories>
  );

  // Attach payment histories to selected schemes
  const result = selectedSchemes.map((selectedScheme: any) => {
    const payments = paymentHistoryMap[selectedScheme._id.toString()] || [];
    return {
      ...selectedScheme.toObject(),
      payment_history: payments,
    };
  });

  res.json({
    success: true,
    message: "Selected schemes fetched successfully.",
    data: result,
  });
};
