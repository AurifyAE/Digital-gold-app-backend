import cron from "node-cron";
import {
  aimPaymentsDailyScheduler,
  aimPaymentsMonthlyScheduler,
  aimPaymentsWeeklyScheduler,
} from "./aimPaymentScheduler";
import { schemePaymentScheduler } from "./schemePaymentScheduler";

class JobScheduler {
  static initializeJobs() {
    // Create daily aim payments for active aims
    // Run everyday at 12:00 AM
    cron.schedule(
      "0 0 * * *",
      () => {
        aimPaymentsDailyScheduler();
        console.log("Creating daily aim payments");
      },
      { timezone: "Asia/Kolkata" }
    );

    // Create weekly aim payments for active aims
    // Run every day at 12:00 AM
    cron.schedule(
      "0 0 * * *",
      () => {
        aimPaymentsWeeklyScheduler();
        console.log("Creating weekly aim payments");
      },
      { timezone: "Asia/Kolkata" }
    );

    // Create monthly aim payments for active aims
    // Run every day at 12:00 AM
    cron.schedule(
      "0 0 * * *",
      () => {
        aimPaymentsMonthlyScheduler();
        console.log("Creating monthly aim payments");
      },
      {
        timezone: "Asia/Kolkata",
      }
    );

    // Create scheme payments for active schemes
    // Run every day at 12:00 AM
    cron.schedule(
      "0 0 * * *",
      () => {
        schemePaymentScheduler();
        console.log("Creating scheme payments");
      },
      { timezone: "Asia/Kolkata" }
    );

    console.log("✅ Cron jobs initialized successfully");
  }
}

export default JobScheduler;
