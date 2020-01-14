import * as dotenv from 'dotenv';

dotenv.config();

export const MONGO_CONN = process.env.MongoConnString;
export const FROM_EMAIL = process.env.FromEmail;
export const FROM_EMAIL_FIRST_NAME = process.env.FromEmailFirstName;
export const FROM_EMAIL_MIDDLE_NAME = process.env.FromEmailMiddleName;
export const FROM_EMAIL_LAST_NAME = process.env.FromEmailLastName;
export const FROM_EMAIL_TITLE = process.env.FromEmailTitle;
export const FROM_PWD = process.env.FromPwd;
export const SMTP_SERVER = process.env.SmtpServer;
export const SMTP_PORT = process.env.SmtpPort;
