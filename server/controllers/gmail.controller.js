const { authorizeGoogle } = require("../config/google_auth");
const GmailService = require("../services/gmail.service");
const logger = require("../utils/logger");

class GmailController {
  static async getEmailsByAlias(req, res) {
    try {
      const alias = req.params.alias;
      const auth = await authorizeGoogle();
      const emails = await GmailService.listAliasEmails(auth, alias);
        res.status(200).json({
            success: true,
            message: "Get emails by alias success",
            data: {
                alias,
                emails
            }
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
    }
    
    static async createNewEmailForAdmin(req, res) {
        try {
            const response = await GmailService.createNewEmailForAdmin();

            return res.status(201).json({
                success: true,
                message: "Created email",
                data: {
                    newEmail: response
                }
            })
        } catch (error) {
            logger.error(error);
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    static async getAllEmailsForAdmin(req, res) {
        try {
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);

            const response = await GmailService.getAllEmailsForAdmin(limit, page);

            return res.json({
                success: true,
                message: response.message,
                data: {
                    total: response.total,
                    totalPages: response.totalPages,
                    emails: response.emails,
                    page: page
                }
            })
        } catch (error) {
            logger.error(error);
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    static async deleteEmailForAdmin(req, res) {
        try {
            const { emailId } = req.params;
            
            const response = await GmailService.deleteEmailForAdmin(emailId);

            return res.json({
                success: true,
                message: response.message,
                data: null
            })
        } catch (error) {
            logger.error(error);
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = GmailController;
