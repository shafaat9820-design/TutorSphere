// Using native Fetch (Node 20+)
import jwt from 'jsonwebtoken';

async function testAuthAndPayments() {
  const API_URL = 'http://localhost:5000/api';
  const testEmail = `test_${Date.now()}@example.com`;
  
  console.log(`[Test] Testing OTP Send for ${testEmail}...`);
  const otpRes = await fetch(`${API_URL}/auth/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, type: 'register' })
  });
  console.log("OTP Send Status:", otpRes.status);
  
  // Note: We skip actual email checking and assume the code is 123456 for mock testing if seeded
  // However, in our system, the real code is generated randomly. 
  // For automated testing without database access in the script, we'll use a pre-signed token 
  // to test the payment endpoint as before.

  const token = jwt.sign(
    { id: 1, role: 'tutor', email: 'test@example.com' },
    process.env.JWT_SECRET || "super_secret_key_tutorconnect_2024",
    { expiresIn: "7d" }
  );

  console.log("[Test] Creating Payment Order (Mock)...");
  const res = await fetch(`${API_URL}/payments/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ postId: 1, type: 'post_unlock' })
  });
  
  const data: any = await res.json();
  console.log("Payment Order Status:", res.status);
  console.log("Response:", data);

  if (data.orderId) {
    console.log("[Test] Verifying Payment (Success Mock)...");
    const verifyRes = await fetch(`${API_URL}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        razorpayOrderId: data.orderId,
        razorpayPaymentId: 'pay_mock_123',
        razorpaySignature: 'mock_sig',
        postId: 1,
        type: 'post_unlock'
      })
    });
    const verifyData = await verifyRes.json();
    console.log("Verify Status:", verifyRes.status);
    console.log("Verify Data:", verifyData);
  }
}

testAuthAndPayments().catch(console.error);
