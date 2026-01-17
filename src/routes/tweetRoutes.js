const express = require('express');
const router = express.Router();
const {
    createTweet,
    updateTweet,
    deleteTweet,
    getTweets,
    getFeed
} = require('../controllers/tweetController');
const { protect } = require('../middleware/authMiddleware');

router.get('/feed', protect, getFeed);
router.route('/').post(protect, createTweet).get(getTweets);
router.route('/:id').put(protect, updateTweet).delete(protect, deleteTweet);

module.exports = router;
