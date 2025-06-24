const nodemailer = require('nodemailer');

// Create transporter for Resend.com (free alternative to Gmail)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 587,
    secure: false,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY || 'your-resend-api-key'
    }
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp, isNewUser = false) => {
  try {
    const transporter = createTransporter();
    
    const subject = isNewUser 
      ? 'Witaj w Korke - Twój kod weryfikacyjny'
      : 'Kod weryfikacyjny - Korke';
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Korke</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Portal korepetycyjny</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">${isNewUser ? 'Witaj w Korke!' : 'Twój kod weryfikacyjny'}</h2>
          
          ${isNewUser ? `
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Dziękujemy za utworzenie konta w naszym portalu korepetycyjnym! 
              Aby dokończyć rejestrację, wprowadź poniższy kod weryfikacyjny.
            </p>
          ` : `
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Otrzymaliśmy prośbę o zalogowanie do Twojego konta. 
              Wprowadź poniższy kod weryfikacyjny, aby się zalogować.
            </p>
          `}
          
          <div style="background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">
              Kod ważny przez 10 minut
            </p>
          </div>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="color: #1976d2; margin: 0; font-size: 14px;">
              <strong>Bezpieczeństwo:</strong> Nigdy nie udostępniaj tego kodu nikomu. 
              Nasz zespół nigdy nie poprosi Cię o kod weryfikacyjny.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Jeśli nie próbowałeś się zalogować, możesz bezpiecznie zignorować ten email.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 12px;">
              © 2024 Korke. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}`);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  testEmailConfig
}; 