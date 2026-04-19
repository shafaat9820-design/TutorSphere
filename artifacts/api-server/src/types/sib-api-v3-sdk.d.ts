declare module 'sib-api-v3-sdk' {
  export const ApiClient: {
    instance: any;
  };
  export class TransactionalEmailsApi {
    sendTransacEmail(sendSmtpEmail: any): Promise<any>;
  }
  export class SendSmtpEmail {
    subject: string;
    sender: { name: string; email: string };
    to: Array<{ email: string; name?: string }>;
    htmlContent?: string;
    textContent?: string;
  }
}
