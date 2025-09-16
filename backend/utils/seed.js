import { User } from "../models/user.models.js";

export async function seedDefaultAdmin() {
  try {
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@123.com';
    const exists = await User.findOne({ email });
    if (exists) {
      console.log('Seed: admin user already exists');
      return;
    }
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    await User.create({
      name: 'Administrator',
      email,
      password,
      role: 'admin'
    });
    console.log(`Seed: default admin created -> ${email} / ${password}`);
  } catch (err) {
    console.warn('Seed: failed to ensure default admin:', err.message);
  }
}
