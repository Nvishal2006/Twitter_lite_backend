const Tweet = require('../models/Tweet');
const User = require('../models/User');


// @desc    Create a tweet
// @route   POST /api/tweets
// @access  Private
const createTweet = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const tweet = await Tweet.create({
            author: req.user.id,
            content,
        });

        const populatedTweet = await Tweet.findById(tweet._id).populate('author', 'username email');

        res.status(201).json(populatedTweet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a tweet
// @route   PUT /api/tweets/:id
// @access  Private (Owner only)
const updateTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);

        if (!tweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }

        // Check for user ownership
        if (tweet.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this tweet' });
        }

        const updatedTweet = await Tweet.findByIdAndUpdate(
            req.params.id,
            { content: req.body.content },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedTweet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a tweet
// @route   DELETE /api/tweets/:id
// @access  Private (Owner only)
const deleteTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);

        if (!tweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }

        // Check for user ownership
        if (tweet.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this tweet' });
        }

        await tweet.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Tweet removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tweets (Optional, for testing)
// @route   GET /api/tweets
// @access  Public
const getTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find().populate('author', 'username').sort({ createdAt: -1 });
        res.status(200).json(tweets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get personalized feed
// @route   GET /api/tweets/feed
// @access  Private
const getFeed = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const currentUser = await User.findById(req.user.id);
        const following = currentUser.following;

        // Fetch tweets from users that the current user follows
        const tweets = await Tweet.find({ author: { $in: following } })
            .populate('author', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json(tweets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get personalized feed
// @route   GET /api/tweets/feed
// @access  Private
const getFeed = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const currentUser = await User.findById(req.user.id);
        const following = currentUser.following;

        // Fetch tweets from users that the current user follows
        const tweets = await Tweet.find({ author: { $in: following } })
            .populate('author', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json(tweets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createTweet,
    updateTweet,
    deleteTweet,
    getTweets,
    getFeed
};
