"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const index_1 = __importDefault(require("../config/index"));
const errors_1 = require("../config/errors");
const error_messages_1 = require("../config/errors/error-messages");
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: index_1.default.EMAIL,
        pass: index_1.default.PASSWORD,
    },
});
const sendExcelByEmail = (email, excelBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: index_1.default.EMAIL,
        to: email,
        subject: 'Excel Character Report',
        html: `<p>You will find the character report attached in Excel format.</p>`,
        attachments: [
            {
                filename: 'characters.xlsx',
                content: excelBuffer,
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        ],
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log('Mail sent successfully');
    }
    catch (error) {
        console.error('Error sending the mail: ', error);
        throw new errors_1.InternalServerError(error_messages_1.ErrorMessagesKeys.ERROR_SENDING_EMAIL);
    }
});
exports.default = sendExcelByEmail;
