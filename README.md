# Ecommerce Backend

Express + MongoDB backend for the SuperSimpleReact ecommerce project.

## Features

- User authentication (register, login, JWT)
- Product CRUD api
- Cart management
- Order creation and list routes
- Chatbot integrations
- CORS support and cookie parser

## Tech Stack

- Node.js
- Express 5
- MongoDB via Mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- cookie-parser

## Getting Started

### Requirements

- Node.js 18+ (or latest LTS)
- MongoDB (Atlas connection URI)

### Install

```bash
cd c:/Users/ibrah/OneDrive/Desktop/SuperSimpleReact/ecommercebackend
npm install
```

### Environment

Create a `.env` file in the repo root with:

```
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
COOKIE_SECRET=<your-cookie-secret-if-needed>
```

### Run in development

```bash
npm run dev
```

Then open `http://localhost:3000` (or where your frontend runs) and connect API calls through `/api/*`.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products`
- `GET /api/cart`
- `POST /api/cart`
- `GET /api/orders`
- `POST /api/orders`
- `POST /api/chatbot/message`

(Refer to route files under `src/routes` for exact payloads.)

## Project Structure

- `server.js`: Entry point, connects DB and starts server.
- `src/app.js`: Express app configuration and routes.
- `src/db/db.js`: MongoDB connection helper.
- `src/routes/*`: API route handlers.
- `src/models/*`: Mongoose schemas.
- `src/controllers/*`: Business logic.

## Notes

- CORS currently allows `http://localhost:5173` (Vite default). Adjust `src/app.js` for production.
- `npm test` is placeholder (no tests configured).

## License

ISC
