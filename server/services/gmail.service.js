const { google } = require("googleapis");
const Email = require("../models/email.model");
const { generateWords } = require("../utils/random");
const { encrypt, decrypt } = require("../utils/crypto");

const BASE_EMAIL = "hoangkien.service";
const BASE_DOMAIN = "@hoangkiendev.io.vn";

class GmailService {
  // For admin
  static async listAliasEmails(auth, alias) {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.messages.list({
      userId: "me",
      q: `to:${alias} from:konami-info@konami.net`,
      maxResults: 10,
    });

    const messages = res.data.messages || [];

    const results = [];
    for (const msg of messages) {
      const detail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      const headers = detail.data.payload.headers;
      const subject = headers.find((h) => h.name === "Subject")?.value;
      const from = headers.find((h) => h.name === "From")?.value;
      const date = headers.find((h) => h.name === "Date")?.value;

      // Extract plain text content from the message body
      let body = "";
      const payload = detail.data.payload;

      if (payload.parts) {
        for (const part of payload.parts) {
          if (part.mimeType === "text/plain" && part.body?.data) {
            body = Buffer.from(part.body.data, "base64").toString("utf-8");
            break; // Stop once we find plain text
          }
        }
      } else if (payload.body?.data) {
        // In case there are no parts, but body is directly available
        body = Buffer.from(payload.body.data, "base64").toString("utf-8");
      }

      results.push({ subject, from, date, body });
    }

    return results;
  }

  static async createNewEmailForAdmin() {
    const newEmail = new Email({
      email: `${BASE_EMAIL}+${generateWords(6)}${BASE_DOMAIN}`,
      password: encrypt(generateWords(10, true)),
    });

    await newEmail.save();

    return newEmail;
  }

  static async getAllEmailsForAdmin(limit = 10, page = 1) {
    const skip = (page - 1) * limit;

    const [emails, total] = await Promise.all([
      Email.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Email.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    const formattedEmails = emails.map((em) => ({
      ...em,
      password: decrypt(em.password),
    }));

    return {
      message: "Get emails success",
      total,
      totalPages,
      emails: formattedEmails,
    };
  }

  static async deleteEmailForAdmin(emailId) {
    const email = await Email.deleteOne({ _id: emailId });
    if (email.deletedCount === 0)
      throw new Error(`Email not found with ${emailId}`);

    return {
      message: "Delete email success",
    };
  }
}

module.exports = GmailService;
