import { MailTemplates } from '../enums/mail-templates.enums.js';

export interface MailOptions {
  template?: MailTemplates;
  data?: Record<string, any>;
}
