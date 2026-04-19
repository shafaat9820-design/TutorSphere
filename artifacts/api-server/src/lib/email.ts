import SibApiV3Sdk from "sib-api-v3-sdk";

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
const BREVO_KEY = (process.env.BREVO_API_KEY || process.env.BREVO_TUTOR || "").trim();
apiKey.apiKey = BREVO_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendSubscriptionSuccessEmail(email: string, name: string, planName: string, expiryDate: string) {
  if (!BREVO_KEY) {
    console.error("[EmailService] Brevo API key is missing");
    throw new Error("Email service configuration error");
  }

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Welcome to TutorSphere Premium!";
    
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
      <h2 style="color: #6366f1; text-align: center;">TutorSphere</h2>
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="font-size: 16px; color: #333;">Hello ${name},</p>
      <p style="font-size: 16px; color: #333;">Your subscription to the <strong>${planName}</strong> plan has been successfully activated!</p>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <p style="margin: 0; color: #475569;">Plan: <strong>${planName}</strong></p>
        <p style="margin: 5px 0 0; color: #475569;">Expires on: <strong>${expiryDate}</strong></p>
      </div>
      <p style="font-size: 16px; color: #333;">You now have full access to premium features to help you succeed on our platform.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://tutorsphere.com/dashboard" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Dashboard</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">TutorSphere © 2024 - Premium Tuition Marketplace</p>
    </div>
  `;
  
  sendSmtpEmail.sender = { 
    name: process.env.BREVO_SENDER_NAME || "TutorSphere", 
    email: process.env.BREVO_SENDER_EMAIL || "noreply@tutorsphere.com" 
  };
  sendSmtpEmail.to = [{ email: email }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`[EmailService] Subscription success email sent to ${email}`);
  } catch (error) {
    console.error("[EmailService] Error sending subscription email:", error);
  }
}

/**
 * Sends an OTP email to the user for registration or password reset.
 */
export async function sendOTPEmail(email: string, otp: string, type: 'register' | 'reset') {
  if (!BREVO_KEY) {
    console.error("[EmailService] Brevo API key is missing (BREVO_API_KEY or BREVO_TUTOR)");
    throw new Error("Email service configuration error");
  } else {
    const hiddenKey = BREVO_KEY.substring(0, 10) + "..." + BREVO_KEY.substring(BREVO_KEY.length - 4);
    console.log(`[EmailService] Using API Key: ${hiddenKey} (Length: ${BREVO_KEY.length})`);
  }

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.subject = type === 'register' 
    ? "Verify your TutorSphere Account" 
    : "Reset your TutorSphere Password";
    
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
      <h2 style="color: #6366f1; text-align: center;">TutorSphere</h2>
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">${type === 'register' ? 'Please use the following OTP to verify your new account:' : 'You requested to reset your password. Use the OTP below to proceed:'}</p>
      <div style="background: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #6366f1;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">This code will expire in 10 minutes.</p>
      <p style="font-size: 14px; color: #666; text-align: center;">If you didn't request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">TutorSphere © 2024 - Premium Tuition Marketplace</p>
    </div>
  `;
  
  sendSmtpEmail.sender = { 
    name: process.env.BREVO_SENDER_NAME || "TutorSphere", 
    email: process.env.BREVO_SENDER_EMAIL || "noreply@tutorsphere.com" 
  };
  sendSmtpEmail.to = [{ email: email }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`[EmailService] OTP sent to ${email}`);
  } catch (error) {
    console.error("[EmailService] Error sending email:", error);
    throw new Error("Failed to send OTP email");
  }
}

