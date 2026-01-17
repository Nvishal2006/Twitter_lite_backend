# Twitter Lite Backend

A simple micro-blogging platform backend built with Node.js, Express, and MongoDB.

## Features
- **User Authentication**: JWT-based registration and login.
- **Micro-blogging**: Create, update, delete tweets.
- **Social Graph**: Follow and unfollow users.
- **News Feed**: Personalized feed of tweets from followed users.
- **Pagination**: Efficient feed retrieval.

## Setup & Running

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Review `.env` file. Default:
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/twitter_lite
    ```
    *Ensure you have MongoDB running locally or update the URI.*

3.  **Run Server**
    ```bash
    npm run dev
    ```

4.  **Run Verification**
    (Requires server running in another terminal)
    ```bash
    node verify_flow.js
    ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tweets
- `POST /api/tweets` - Create a tweet
- `GET /api/tweets` - Get all tweets (public)
- `PUT /api/tweets/:id` - Update tweet (owner only)
- `DELETE /api/tweets/:id` - Delete tweet (owner only)
- `GET /api/tweets/feed` - Get personalized feed

### Users
- `POST /api/users/:id/follow` - Follow a user
- `POST /api/users/:id/unfollow` - Unfollow a user
