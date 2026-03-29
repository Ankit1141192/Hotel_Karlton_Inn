const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const testApi = async () => {
    console.log('--- 🧪 Starting API Tests ---');

    try {
        // 1. Health Check
        console.log('\n[1/5] Health Check...');
        const health = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health Check Success:', health.data.message);

        // 2. Signup Test
        console.log('\n[2/5] Testing Signup...');
        const uniqueEmail = `testuser_${Date.now()}@example.com`;
        const signupData = {
            name: 'Test User',
            email: uniqueEmail,
            password: 'password123',
            phone: '1234567890'
        };

        const signupRes = await axios.post(`${BASE_URL}/auth/register`, signupData);
        console.log('✅ Signup Success:', signupRes.data.message);
        const token = signupRes.data.token;
        const userId = signupRes.data.user._id;

        // 3. Login Test
        console.log('\n[3/5] Testing Login...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: uniqueEmail,
            password: 'password123'
        });
        console.log('✅ Login Success:', loginRes.data.message);

        // 4. Get Current User (Me)
        console.log('\n[4/5] Testing Auth Me...');
        const meRes = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Get Me Success:', meRes.data.user.name);

        // 5. Admin Stats (Should fail for regular user)
        console.log('\n[5/5] Testing Admin Stats (Expecting Failure for regular user)...');
        try {
            await axios.get(`${BASE_URL}/users/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('❌ Admin Stats accessed by regular user (Bug!)');
        } catch (err) {
            console.log('✅ Admin Stats correctly denied for regular user:', err.response?.data?.message || err.message);
        }

        console.log('\n--- 🧪 Tests Completed ---');
    } catch (error) {
        console.error('\n❌ Test Failed!');
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error Message:', error.message);
        }
    }
};

testApi();
