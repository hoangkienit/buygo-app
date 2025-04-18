const { google } = require("googleapis");

class GmailService {
  static async listAliasEmails(auth, alias) {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.messages.list({
      userId: "me",
      q: `to:${alias}`,
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
      results.push({ subject, from, date });
    }

    return results;
  }
}

module.exports = GmailService;
