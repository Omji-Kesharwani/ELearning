const express = require("express");
const app = express();
const path = require("path");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 4000;

// ------------------------------------------
// ✅ Database Connection
// ------------------------------------------
database.connect();

// ------------------------------------------
// ✅ Allowed Origins for CORS
// ------------------------------------------
const allowedOrigins = [
  "https://localhost:3000", // local development
  "https://e-learning-qjfh.vercel.app", // deployed frontend on Vercel
];

// ------------------------------------------
// ✅ Middlewares
// ------------------------------------------
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// ------------------------------------------
// ✅ Cloudinary Config
// ------------------------------------------
cloudinaryConnect();

// ------------------------------------------
// ✅ API Routes
// ------------------------------------------
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// ------------------------------------------
// ✅ Default Route
// ------------------------------------------
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

// ------------------------------------------
// ✅ Start Server
// ------------------------------------------
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
