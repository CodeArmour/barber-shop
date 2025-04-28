import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  htmlContent: string;
}

export async function sendMail({ to, subject, htmlContent }: MailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_API_EMAIL,
        pass: process.env.NEXT_PUBLIC_API_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_API_EMAIL,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    // Verify connection configuration
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return { success: true, messageId: info.messageId };

  } catch (error:any) {
    console.error('Error sending email:', error.message);
    throw new Error(`Failed to send email:, ${error.message}`);
  }
}