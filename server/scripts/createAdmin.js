require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/User');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n✅ Connected to MongoDB');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   PizzaHub — Create Admin Account');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const name = await ask('Admin name: ');
    const email = await ask('Admin email: ');
    const password = await ask('Admin password (min 8 chars): ');

    if (!name || !email || !password) {
      console.error('\n❌ All fields are required.');
      process.exit(1);
    }
    if (password.length < 8) {
      console.error('\n❌ Password must be at least 8 characters.');
      process.exit(1);
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      if (existing.role === 'admin') {
        console.log('\n⚠️  An admin with that email already exists.');
      } else {
        // Promote existing customer to admin
        existing.role = 'admin';
        await existing.save();
        console.log(`\n✅ User "${existing.name}" promoted to admin.`);
      }
      rl.close();
      process.exit(0);
    }

    await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'admin',
    });

    console.log(`\n✅ Admin account created for: ${email.trim()}`);
    console.log('   You can now log in at /login and access /admin\n');
    rl.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    rl.close();
    process.exit(1);
  }
};

createAdmin();
