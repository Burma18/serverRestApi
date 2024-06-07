# Server REST API

This project is a RESTful API server built with Node.js, Express, and Prisma for handling user authentication, file management, and token handling.

## Features

- User authentication with JWT
- File upload, download, and management
- Pagination for file listings
- Token management for multiple devices

## Technologies

- Node.js
- Express
- Prisma
- JWT
- Multer
- MySql

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory:

    ```env
    DATABASE_URL=mysql://username:password@localhost:5432/your-database
    JWT_SECRET=your_jwt_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    ```

4. **Run database migrations:**

    ```bash
    npx prisma migrate dev
    ```

5. **Start the server:**

    ```bash
    npm start
    ```
