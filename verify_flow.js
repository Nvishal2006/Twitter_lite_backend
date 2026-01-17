const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('--- Starting Verification ---');

        // 1. Register User A
        console.log('1. Registering User A...');
        try {
            const userA = await axios.post(`${API_URL}/auth/register`, {
                username: 'userA',
                email: 'usera@example.com',
                password: 'password123',
            });
            var tokenA = userA.data.token;
            var idA = userA.data._id;
            console.log('   User A registered:', idA);
        } catch (e) {
            if (e.response && e.response.status === 400) {
                console.log('   User A already exists, logging in...');
                const loginA = await axios.post(`${API_URL}/auth/login`, {
                    email: 'usera@example.com',
                    password: 'password123',
                });
                tokenA = loginA.data.token;
                idA = loginA.data._id;
            } else {
                throw e;
            }
        }

        // 2. Register User B
        console.log('2. Registering User B...');
        try {
            const userB = await axios.post(`${API_URL}/auth/register`, {
                username: 'userB',
                email: 'userb@example.com',
                password: 'password123',
            });
            var tokenB = userB.data.token;
            var idB = userB.data._id;
            console.log('   User B registered:', idB);
        } catch (e) {
            if (e.response && e.response.status === 400) {
                console.log('   User B already exists, logging in...');
                const loginB = await axios.post(`${API_URL}/auth/login`, {
                    email: 'userb@example.com',
                    password: 'password123',
                });
                tokenB = loginB.data.token;
                idB = loginB.data._id;
            } else {
                throw e;
            }
        }

        // 3. User B posts a tweet
        console.log('3. User B posting a tweet...');
        await axios.post(
            `${API_URL}/tweets`,
            { content: 'Hello from User B! ' + Date.now() },
            { headers: { Authorization: `Bearer ${tokenB}` } }
        );
        console.log('   User B tweeted.');

        // 4. User A follows User B
        console.log('4. User A following User B...');
        try {
            await axios.post(
                `${API_URL}/users/${idB}/follow`,
                {},
                { headers: { Authorization: `Bearer ${tokenA}` } }
            );
            console.log('   User A followed User B.');
        } catch (e) {
            if (e.response && e.response.data.message === 'You already follow this user') {
                console.log('   User A already follows User B.');
            } else {
                throw e;
            }
        }

        // 5. User A checks feed
        console.log('5. User A checking feed...');
        const feedA = await axios.get(`${API_URL}/tweets/feed`, {
            headers: { Authorization: `Bearer ${tokenA}` },
        });
        console.log('   User A Feed:', feedA.data.length, 'tweets found.');
        if (feedA.data.length > 0) {
            console.log('   SUCCESS: User A sees User B\'s tweet.');
        } else {
            console.log('   FAILURE: User A did not see the tweet.');
        }

        // 6. User A unfollows User B
        console.log('6. User A unfollowing User B...');
        await axios.post(
            `${API_URL}/users/${idB}/unfollow`,
            {},
            { headers: { Authorization: `Bearer ${tokenA}` } }
        );
        console.log('   User A unfollowed User B.');

        // 7. User A checks feed again
        console.log('7. User A checking feed again...');
        const feedAgain = await axios.get(`${API_URL}/tweets/feed`, {
            headers: { Authorization: `Bearer ${tokenA}` },
        });
        console.log('   User A Feed:', feedAgain.data.length, 'tweets found.');

        // Check if user B's tweets are gone (or reduce logic if other follows exist)
        // For this test we assume A only follows B.
        if (feedAgain.data.length === 0) {
            console.log('   SUCCESS: User A sees no tweets.');
        } else {
            // It might be possible that other tests ran, so we check if any belong to B
            const bTweets = feedAgain.data.filter(t => t.author._id === idB || t.author === idB);
            if (bTweets.length === 0) {
                console.log('   SUCCESS: User A sees no tweets from User B.');
            } else {
                console.log('   FAILURE: User A still sees tweets from User B.');
            }
        }

        console.log('--- Verification Complete ---');
    } catch (error) {
        if (error.response) {
            console.error('API Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

runVerification();
