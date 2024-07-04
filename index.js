import { config } from "dotenv";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import multer from "multer";
import path from "path";

config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // from the env
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-email", upload.single("attachment"), (req, res) => {
  const { name, email, content } = req.body;
  const file = req.file;

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Your Product",
      link: "https://yourproduct.com/",
    },
  });

  const emailTemplate = {
    body: {
      name,
      intro: content,
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const emailBody = mailGenerator.generate(emailTemplate);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "HAIIII!",
    html: emailBody,
    attachments: [
      {
        filename: file.originalname,
        path: file.path
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: error.toString() });
    }
    res.status(200).json({ message: "Email sent", info });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
