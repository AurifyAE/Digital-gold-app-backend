import cron from "node-cron";
import {
  aimPaymentsDailyScheduler,
  aimPaymentsMonthlyScheduler,
  aimPaymentsWeeklyScheduler,
} from "./aimPaymentScheduler";

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
    // Run every Monday at 12:00 AM
    cron.schedule(
      "0 0 * * 1",
      () => {
        aimPaymentsWeeklyScheduler();
        console.log("Creating weekly aim payments");
      },
      { timezone: "Asia/Kolkata" }
    );

    // Create monthly aim payments for active aims
    // Run every month 1st day at 12:00 AM
    cron.schedule(
      "0 0 1 * *",
      () => {
        aimPaymentsMonthlyScheduler();
        console.log("Creating monthly aim payments");
      },
      {
        timezone: "Asia/Kolkata",
      }
    );

    console.log("✅ Cron jobs initialized successfully");
  }
}

export default JobScheduler;
