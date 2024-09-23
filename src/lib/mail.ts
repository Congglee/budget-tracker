import {
  RESET_PASSWORD_EMAIL_TEMPLATE,
  TWO_FACTOR_AUTHENTICATION_EMAIL_TEMPLATE,
  VERIFY_EMAIL_TEMPLATE,
} from "@/lib/templates";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  await resend.emails.send({
    from: "'Budget Tracker' <no-reply@conggglee-dev.com>",
    to: email,
    subject: "Confirm your email",
    html: VERIFY_EMAIL_TEMPLATE.replace(
      "{{confirm_link}}",
      confirmLink
    ).replace("{{user_name}}", email),
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  await resend.emails.send({
    from: "'Budget Tracker' <no-reply@conggglee-dev.com>",
    to: email,
    subject: "Reset your password",
    html: RESET_PASSWORD_EMAIL_TEMPLATE.replace(
      "{{reset_link}}",
      resetLink
    ).replace("{{user_name}}", email),
  });
}

export async function sendTwoFactorTokenEmail(email: string, token: string) {
  await resend.emails.send({
    from: "'Budget Tracker' <no-reply@conggglee-dev.com>",
    to: email,
    subject: "2FA code",
    html: TWO_FACTOR_AUTHENTICATION_EMAIL_TEMPLATE.replace(
      "{{auth_code}}",
      token
    ).replace("{{user_name}}", email),
  });
}
