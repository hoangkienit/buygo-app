const cron = require("node-cron");
const {DepositHistory} = require("./../models/transaction.model");

// Avoid duplicate scheduling
let isTaskRunning = false;

cron.schedule("* * * * *", async () => {
  if (isTaskRunning) return; // Prevent duplicate execution
  isTaskRunning = true;

  try {
    const expiredTime = new Date(Date.now() - 60* 60 * 1000); // 60 min ago
    await DepositHistory.updateMany(
      { transactionStatus: "pending", createdAt: { $lte: expiredTime } },
      { transactionStatus: "failed" }
    );
    console.log(`Marked failed pending transaction.`);
  } catch (error) {
    console.error("Error updating transactions:", error);
  } finally {
    isTaskRunning = false;
  }
});

// Delete old transactions daily at midnight
// cron.schedule("0 0 * * *", async () => {
//   try {
//     await Transaction.deleteMany({ createdAt: { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
//     console.log("Deleted old transactions.");
//   } catch (error) {
//     console.error("Error deleting transactions:", error);
//   }
// });
