import { cleanEnv, num, str } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

export default cleanEnv(process.env, {
  DB_URL: str(),
  APP_PORT: num({ default: 3000 }),
  WS_PORT: num({ default: 80 }),
  JWT_ACCESS_SECRET_KEY: str(),
  JWT_REFRESH_SECRET_KEY: str(),
  JWT_RECOVERY_SECRET_KEY: str(),
  MAIL_URL_TRANSPORT: str(),
  MAIL_FROM_NAME: str(),
  MAIL_FROM: str(),
  WS_CORS_ORIGIN: str({ default: '*' }),
  APP_CORS_ORIGIN: str({ default: '*' }),
});
