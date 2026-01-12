const express = require("express");
const router = express.Router();
const adminCtrl = require("../logic/adminManager");
const { authorize } = require("../protection/gatekeeper");
router.get("/stats", authorize(["admin"]), adminCtrl.getGlobalStats);
router.get("/users", authorize(["admin"]), adminCtrl.listAllSupporters);
router.get("/export", authorize(["admin"]), adminCtrl.downloadReport);
router.get("/insights", authorize(["admin"]), adminCtrl.getFinancialInsights); // New!
router.get(
  "/all-donations",
  authorize(["admin"]),
  adminCtrl.fetchRegistrySnapshot
);

module.exports = router;
