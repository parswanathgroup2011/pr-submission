// routes/Downloadpr.js
const express = require("express");
const PDFDocument = require("pdfkit");
const PressRelease = require("../Models/pressRelease"); 
const ensureAuthenticated = require("../Middleware/Auth");
const router = express.Router();

// 🟢 Download PR as PDF
router.get("/:id", ensureAuthenticated, async (req, res) => {
  try {
    // ✅ Fetch PR with populated plan & category
    const pr = await PressRelease.findById(req.params.id)
      .populate("selectedPlan")
      .populate("selectedCategory");

    if (!pr) return res.status(404).send("PR not found");

    const ownerId = pr.userId?._id || pr.userId;
    const isOwnerOrAdmin =
      req.user?.role === "admin" || String(ownerId) === String(req.user._id);

    if (!isOwnerOrAdmin) {
      return res.status(403).send("Access denied");
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // Set headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${pr.prId || pr._id}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // =======================
    // 🖊 HEADER
    // =======================
    doc.fontSize(22).text(pr.title, { align: "center", underline: true });
    doc.moveDown();

    // =======================
    // 📝 Basic Info
    // =======================
    doc.fontSize(14).text("Summary:", { underline: true });
    doc.fontSize(12).text(pr.summary || "N/A");
    doc.moveDown();

    doc.fontSize(14).text("Content:", { underline: true });
    doc.fontSize(12).text(pr.content?.replace(/<[^>]+>/g, "") || "N/A");
    doc.moveDown();

    doc.fontSize(14).text("Details:", { underline: true });
    doc.fontSize(12).text(`City: ${pr.city || "-"}`);
    doc.text(`Quote: ${pr.quoteDescription || "-"}`);
    doc.text(`Tags: ${pr.tags?.join(", ") || "-"}`);
    doc.text(`Scheduled At: ${pr.scheduledAt ? new Date(pr.scheduledAt).toLocaleString() : "-"}`);
    doc.text(`Status: ${pr.status || "N/A"}`);
    doc.moveDown();

    // =======================
    // 📦 Plan Details
    // =======================
    if (pr.selectedPlan) {
      doc.fontSize(14).text("Plan Details:", { underline: true });
      doc.fontSize(12).text(`Name: ${pr.selectedPlan.name}`);
      doc.text(`Credits: ${pr.selectedPlan.credits}`);
      doc.text(`TAT: ${pr.selectedPlan.tat || "-"}`);
      doc.text(`Disclaimer: ${pr.selectedPlan.disclaimer || "-"}`);
      doc.text(`Backlink: ${pr.selectedPlan.backlink || "-"}`);
      doc.text(`Highlights: ${pr.selectedPlan.highlights?.join(", ") || "-"}`);
      doc.text(`Type: ${pr.selectedPlan.type || "-"}`);
      doc.moveDown();
    }

    // =======================
    // 🗂 Category Details
    // =======================
    if (pr.selectedCategory) {
      doc.fontSize(14).text("Category Details:", { underline: true });
      doc.fontSize(12).text(`Name: ${pr.selectedCategory.name}`);
      doc.text(`Active: ${pr.selectedCategory.isActive ? "Yes" : "No"}`);
     
      doc.moveDown();
    }

    // =======================
    // 📅 Timestamps
    // =======================
    doc.fontSize(12).text(`Created At: ${new Date(pr.createdAt).toLocaleString()}`);
    doc.text(`Updated At: ${new Date(pr.updatedAt).toLocaleString()}`);

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});

module.exports = router;
