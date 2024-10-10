const express = require("express");
const QRCode = require("qrcode");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON bodies

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the QR Code Generator API");
});

// Route to generate QR code with custom options
app.post("/api/generate-qr", async (req, res) => {
  const { text, color, bgColor, errorCorrectionLevel } = req.body;

  // Validate the input
  if (!text) {
    return res.status(400).json({ error: "Text or URL is required to generate a QR code" });
  }

  try {
    // QR code options
    const options = {
      color: {
        dark: color || "#000000", // Foreground color (black default)
        light: bgColor || "#ffffff", // Background color (white default)
      },
      errorCorrectionLevel: errorCorrectionLevel || "L", // Default error correction level
    };

    // Generate QR code as a data URL
    const qrCodeUrl = await QRCode.toDataURL(text, options);
    res.json({ qrCodeUrl }); // Respond with the QR code URL
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`QR Code Generator Server running on http://localhost:${PORT}`);
});
