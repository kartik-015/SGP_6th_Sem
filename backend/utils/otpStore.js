// Simple in-memory OTP store with expiry
// Not for production use. Replace with Redis or database-backed store for real deployments.

const otpStore = new Map(); // key -> { code, phone, expiresAt }

/**
 * Create an OTP entry
 * @param {string} key
 * @param {string} phone
 * @param {number} ttlMs
 * @returns {string} code
 */
export function createOtp(key, phone, ttlMs = 5 * 60 * 1000) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + ttlMs;
    otpStore.set(key, { code, phone, expiresAt });
    return code;
}

/** Verify code and consume if valid */
export function verifyOtp(key, code) {
    const entry = otpStore.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
        otpStore.delete(key);
        return false;
    }
    const ok = entry.code === String(code);
    if (ok) otpStore.delete(key);
    return ok;
}

export function getOtpPhone(key) {
    return otpStore.get(key)?.phone || null;
}


