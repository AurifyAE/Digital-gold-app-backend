import cron from "node-cron";
import {
  aimPaymentsDailyScheduler,
  aimPaymentsMonthlyScheduler,
  aimPaymentsWeeklyScheduler,
} from "./aimPaymentScheduler";
import { schemePaymentScheduler } from "./schemePaymentScheduler";

class JobScheduler {
  static initializeJobs() {
    cron.schedule(
      // Run everyday at 12:00 AM
      "0 0 * * *",
      () => {
        aimPaymentsDailyScheduler();
        aimPaymentsWeeklyScheduler();
        aimPaymentsMonthlyScheduler();
        schemePaymentScheduler();
        console.log("All schemes and aims payments created...");
      },
      { timezone: "Asia/Kolkata" }
    );
    console.log("✅ Cron jobs initialized successfully");
  }
}

export default JobScheduler;
