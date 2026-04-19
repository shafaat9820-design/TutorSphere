import { config } from 'dotenv';
config({ path: '../../.env' });
import jwt from 'jsonwebtoken';

async function run() {
  const token = jwt.sign(
    { id: 1, role: 'tutor', email: 'tutorsphereofficial@gmail.com' },
    process.env.JWT_SECRET || "tutorconnect_secret_key_2024",
    { expiresIn: "7d" }
  );

  console.log("Using Secret:", process.env.JWT_SECRET);
  console.log("Token:", token);

  const res = await fetch('http://localhost:5000/api/payments/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ postId: 0, type: 'monthly_plan' })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}
run().catch(console.error);
