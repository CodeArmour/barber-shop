import { Resend } from "resend";
import { formatDisplayDate } from "@/utils/date-helper";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AppointmentEmailData {
    date: Date;
    timeSlot: string;
    barberId: string;
    serviceId: string;
    name: string;
    phone?: string;
    email: string;
  }
  
  interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
  }
  
  // Common email header
  function getEmailHeader() {
    return `
    <div style="text-align: center; margin-bottom: 30px; padding: 20px; border-radius: 8px;">
      <h1 style="color: #d97706; font-family: 'Trebuchet MS', sans-serif; margin: 12px 0 5px 0; font-size: 28px;">
        Sharp Cuts
      </h1>
      <p style="color: #6b7280; margin: 0; font-style: italic;">Premier Barbershop Experience</p>
    </div>`;
  }
  
  // Common email footer
  function getEmailFooter() {
    return `
    <div style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">© ${new Date().getFullYear()} Sharp Cuts</p>
      <p style="color: #6b7280; font-size: 14px;">123 Main Street, Your City</p>
      <p style="color: #6b7280; font-size: 14px;">Phone: (555) 123-4567</p>
      <div style="margin-top: 15px;">
      </div>
    </div>`;
  }
  
  export async function sendAppointmentConfirmationResend(
    bookingData: AppointmentEmailData,
    barberName: string,
    serviceName: string,
    servicePrice: number
  ): Promise<EmailResult> {
    try {
      const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          ${getEmailHeader()}
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">Dear <strong>${bookingData.name}</strong>,</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">Thank you for booking with Sharp Cuts. Your appointment request has been successfully received and is now <strong>pending confirmation</strong> from your barber.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h3 style="margin-top: 0; color: #d97706; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Appointment Details:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold; width: 30%;">Date:</td>
                <td style="padding: 8px 0; color: #1f2937;">${formatDisplayDate(bookingData.date)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Time:</td>
                <td style="padding: 8px 0; color: #1f2937;">${bookingData.timeSlot}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Barber:</td>
                <td style="padding: 8px 0; color: #1f2937;">${barberName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Service:</td>
                <td style="padding: 8px 0; color: #1f2937;">${serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Price:</td>
                <td style="padding: 8px 0; color: #1f2937;">$${servicePrice.toFixed(2)}</td>
              </tr>
            </table>
            <div style="padding: 12px; background-color: #fff4e5; border-left: 4px solid #d97706; margin-top: 15px; border-radius: 4px;">
              <p style="margin: 0; color: #92400e;"><strong>Status:</strong> Pending barber confirmation</p>
            </div>
          </div>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">Your barber will confirm your appointment as soon as possible. You'll receive another email once your appointment is confirmed.</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">If you need to make any changes or have questions about your appointment, please contact us directly.</p>
          
          ${getEmailFooter()}
        </div>
      `;
  
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [bookingData.email],
        subject: "Your Sharp Cuts Appointment Request",
        html: htmlContent,
      });
  
      if (error) {
        console.error("Error sending confirmation email:", error);
        return { success: false, error: error.message };
      }
  
      return { success: true, messageId: data?.id };
    } catch (error: any) {
      console.error("Error sending confirmation email:", error);
      return { success: false, error: error.message };
    }
  }





  export async function sendAppointmentConfirmedEmailResend(
    appointment: any
  ): Promise<EmailResult> {
    try {
      const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          ${getEmailHeader()}
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">Dear <strong>${appointment.customerName}</strong>,</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">Great news! Your appointment has been <strong>confirmed</strong> by your barber at Sharp Cuts.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h3 style="margin-top: 0; color: #22c55e; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Confirmed Appointment Details:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold; width: 30%;">Date:</td>
                <td style="padding: 8px 0; color: #1f2937;">${formatDisplayDate(appointment.date)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Time:</td>
                <td style="padding: 8px 0; color: #1f2937;">${appointment.time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Barber:</td>
                <td style="padding: 8px 0; color: #1f2937;">${appointment.barber.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Service:</td>
                <td style="padding: 8px 0; color: #1f2937;">${appointment.service.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Price:</td>
                <td style="padding: 8px 0; color: #1f2937;">$${appointment.service.price.toFixed(2)}</td>
              </tr>
            </table>
            <div style="padding: 12px; background-color: #ecfdf5; border-left: 4px solid #22c55e; margin-top: 15px; border-radius: 4px;">
              <p style="margin: 0; color: #166534;"><strong>Status:</strong> Confirmed ✓</p>
            </div>
          </div>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #d97706;">Appointment Tips:</h4>
            <ul style="padding-left: 20px; color: #4b5563;">
              <li style="margin-bottom: 8px;">Please arrive 5-10 minutes before your scheduled time</li>
              <li style="margin-bottom: 8px;">Bring reference photos if you have a specific style in mind</li>
              <li style="margin-bottom: 8px;">If you need to cancel, please give us 24 hours notice</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">We've reserved your spot and are looking forward to providing you with an excellent haircut experience.</p>
          
          ${getEmailFooter()}
        </div>
      `;
  
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: appointment.customerEmail,
        subject: "Your Sharp Cuts Appointment is Confirmed",
        html: htmlContent,
      });
  
      if (error) {
        console.error("Error sending confirmation email:", error);
        return { success: false, error: error.message };
      }
  
      return { success: true, messageId: data?.id };
    } catch (error: any) {
      console.error("Error sending confirmation email:", error);
      return { success: false, error: error.message };
    }
  }



  export async function sendAppointmentCancelledEmailResend(
    appointment: any
  ): Promise<EmailResult> {
    try {
      const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          ${getEmailHeader()}
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">Dear <strong>${appointment.customerName}</strong>,</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">We're writing to inform you that your appointment at Sharp Cuts has been <strong>cancelled</strong>.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h3 style="margin-top: 0; color: #ef4444; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Cancelled Appointment Details:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold; width: 30%;">Date:</td>
                <td style="padding: 8px 0; color: #1f2937;">${formatDisplayDate(appointment.date)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Time:</td>
                <td style="padding: 8px 0; color: #1f2937;">${appointment.time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Barber:</td>
                <td style="padding: 8px 0; color: #1f2937;">${appointment.barber.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Service:</td>
                <td style="padding: 8px 0; color: #1f2937;">${appointment.service.name}</td>
              </tr>
            </table>
            <div style="padding: 12px; background-color: #fef2f2; border-left: 4px solid #ef4444; margin-top: 15px; border-radius: 4px;">
              <p style="margin: 0; color: #b91c1c;"><strong>Status:</strong> Cancelled</p>
            </div>
          </div>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">If you believe this was done in error or would like to book another appointment, please contact us or visit our website.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="YOUR_BOOKING_URL" style="display: inline-block; padding: 12px 28px; background-color: #d97706; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Book a New Appointment</a>
          </div>
          
          ${getEmailFooter()}
        </div>
      `;
    
      // Send email using Resend directly
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev", // Replace with your actual sending domain
        to: appointment.customerEmail,
        subject: "Sharp Cuts Appointment - Cancellation Notice",
        html: htmlContent,
      });
  
      if (error) {
        console.error("Error sending cancellation email:", error);
        return { success: false, error: error.message };
      }
  
      return { success: true, messageId: data?.id };
    } catch (error: any) {
      console.error("Error sending cancellation email:", error);
      return { success: false, error: error.message };
    }
  }
  
  export async function sendAppointmentCompletedEmailResend(
    appointment: any
  ): Promise<EmailResult> {
    try {
      const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          ${getEmailHeader()}
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">Dear <strong>${appointment.customerName}</strong>,</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">Thank you for choosing Sharp Cuts for your recent visit. We hope you're enjoying your fresh new look!</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h3 style="margin-top: 0; color: #6366f1; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Visit Details:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold; width: 30%;">Date:</td>
                <td style="padding: 8px 0; color: #1f2937;">${formatDisplayDate(appointment.date)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Service:</td>
                <td style="padding: 8px 0; color: #1f2937;">${appointment.service.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Barber:</td>
                <td style="padding: 8px 0; color: #1f2937;">${appointment.barber.name}</td>
              </tr>
            </table>
            <div style="padding: 12px; background-color: #eef2ff; border-left: 4px solid #6366f1; margin-top: 15px; border-radius: 4px;">
              <p style="margin: 0; color: #4338ca;"><strong>Status:</strong> Completed ✓</p>
            </div>
          </div>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h4 style="margin-top: 0; color: #d97706;">How was your experience?</h4>
            <p style="color: #4b5563; margin-bottom: 15px;">We'd love to hear your feedback!</p>
            <div>
              <a href="YOUR_FEEDBACK_URL" style="display: inline-block; padding: 10px 20px; background-color: #f3f4f6; color: #4b5563; text-decoration: none; border-radius: 4px; margin: 0 5px; border: 1px solid #e5e7eb;">★★★★★</a>
            </div>
          </div>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">To maintain your style at its best, we recommend booking your next appointment in 3-4 weeks.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="YOUR_BOOKING_URL" style="display: inline-block; padding: 12px 28px; background-color: #d97706; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Book Your Next Appointment</a>
          </div>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6; text-align: center;">Use code <strong>SHARPRETURN</strong> for 10% off your next visit!</p>
          
          ${getEmailFooter()}
        </div>
      `;
  
      // Send email using Resend directly
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [appointment.customerEmail],
        subject: "Thank You for Visiting Sharp Cuts",
        html: htmlContent,
      });
  
      if (error) {
        console.error("Error sending completion email:", error);
        return { success: false, error: error.message };
      }
  
      return { success: true, messageId: data?.id };
    } catch (error: any) {
      console.error("Error sending completion email:", error);
      return { success: false, error: error.message };
    }
  }