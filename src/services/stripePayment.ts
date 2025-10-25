import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-09-30.clover"
});
