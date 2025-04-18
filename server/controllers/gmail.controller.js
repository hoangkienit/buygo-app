const { authorizeGoogle } = require("../config/google_auth");
const GmailService = require("../services/gmail.service");
const logger = require("../utils/logger");

class GmailController {
  static async getEmailsByAlias(req, res) {
    try {
      const alias = req.params.alias;
      const auth = await authorizeGoogle();
      const emails = await GmailService.listAliasEmails(auth, alias);
      res.json({ alias, emails });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
  }
}

module.exports = GmailController;
