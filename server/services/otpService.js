const crypto = require('crypto');

// In-memory storage for OTP codes (in production, use Redis or database)
const otpStorage = new Map();

// Generate OTP code
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Store OTP with expiration
const storeOTP = (email, otp, userData = null) => {
  const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes
  otpStorage.set(email, {
    otp,
    expiresAt,
    userData,
    attempts: 0
  });
  
  console.log('🔐 OTP stored for:', email, 'Code:', otp, 'Expires:', new Date(expiresAt).toLocaleTimeString());
  
  // Clean up expired OTPs
  setTimeout(() => {
    if (otpStorage.has(email)) {
      const stored = otpStorage.get(email);
      if (stored.expiresAt < Date.now()) {
        otpStorage.delete(email);
        console.log('🗑️ OTP expired and removed for:', email);
      }
    }
  }, 10 * 60 * 1000);
};

// Verify OTP
const verifyOTP = (email, otp) => {
  console.log('🔐 Verifying OTP for:', email, 'Input:', otp);
  console.log('🔐 Stored OTPs:', Array.from(otpStorage.keys()));
  
  const stored = otpStorage.get(email);
  
  if (!stored) {
    console.log('❌ No OTP found for email:', email);
    return { valid: false, message: 'Kod OTP wygasł lub nie został wysłany' };
  }
  
  if (stored.expiresAt < Date.now()) {
    console.log('❌ OTP expired for email:', email);
    otpStorage.delete(email);
    return { valid: false, message: 'Kod OTP wygasł' };
  }
  
  if (stored.attempts >= 3) {
    console.log('❌ Too many attempts for email:', email);
    otpStorage.delete(email);
    return { valid: false, message: 'Przekroczono limit prób. Kod OTP został unieważniony' };
  }
  
  stored.attempts++;
  
  if (stored.otp !== otp) {
    console.log('❌ Invalid OTP for email:', email, 'Expected:', stored.otp, 'Got:', otp);
    return { valid: false, message: 'Nieprawidłowy kod OTP' };
  }
  
  console.log('✅ OTP verified successfully for email:', email);
  otpStorage.delete(email);
  return { valid: true, message: 'Kod OTP poprawny' };
};

// Send OTP (development mode - console output)
const sendOTP = async (email, otp, isNewUser = false) => {
  try {
    console.log('\n==================================================');
    console.log('📧 OTP EMAIL (Development Mode)');
    console.log('==================================================');
    console.log('📧 To:', email);
    console.log('🔐 OTP Code:', otp);
    console.log('📝 Type:', isNewUser ? 'New User Registration' : 'Login');
    console.log('⏰ Expires: 10 minutes');
    console.log('==================================================\n');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending OTP:', error);
    return { success: false, error: error.message };
  }
};

// Get OTP for testing
const getStoredOTP = (email) => {
  const stored = otpStorage.get(email);
  return stored ? stored.otp : null;
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendOTP,
  getStoredOTP
}; 