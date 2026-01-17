const express = require("express");
const router = express.Router();
const adminCtrl = require("../logic/adminManager");
const { authorize } = require("../protection/gatekeeper");
router.get("/stats", authorize(["admin","superadmin"]), adminCtrl.getGlobalStats);
router.get("/users", authorize(["admin","superadmin"]), adminCtrl.listAllSupporters);
router.get("/export", authorize(["admin","superadmin"]), adminCtrl.downloadReport);
router.get("/insights", authorize(["admin","superadmin"]), adminCtrl.getFinancialInsights); // New!
router.get(
  "/all-donations",
  authorize(["admin","superadmin"]),
  adminCtrl.fetchRegistrySnapshot
);

// Superadmin actions: view pending admin signups and approve
router.get('/pending-admins', authorize(['superadmin']), adminCtrl.listPendingAdmins);
router.post('/approve-admin', authorize(['superadmin']), adminCtrl.approveAdmin);

// Export donations grouped by donor totals
router.get('/export-donations', authorize(['admin','superadmin']), adminCtrl.exportDonorTotals);

module.exports = router;
