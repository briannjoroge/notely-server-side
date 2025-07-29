# Notely App (Server Side)

This is the backend API for Notely, a note-taking web application. It is built with Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL. The backend handles authentication, user management, and note CRUD operations.

## Features

- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Create, edit, delete, restore, and view notes
- User profile management (update info, change password)
- API endpoints protected by JWT middleware
- Prisma ORM for database access
- Environment variable support via `.env`

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) database

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/briannjoroge/notely-server-side.git

   cd notely-server-side
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env` and fill in the required values:

     ```
     DATABASE_URL=your_postgres_connection_string

     eg. DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

     JWT_SECRET=your_jwt_secret_key
     PORT=5000

     eg. JWT_SECRET = "7hhiuifjw88576jhguf83hvi";
     ```

   - Make sure your PostgreSQL database is running and accessible.

4. **Set up the database:**

   - Run Prisma migrations to create tables:

     ```sh
     npx prisma migrate dev --name init
     ```

   - Generate Prisma client:
     ```sh
     npx prisma generate
     ```

5. **Start the development server:**
   ```sh
   npm run dev
   ```
   - The server will start on `http://localhost:5000` (or the port you set in `index.ts`).

## API Endpoints

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT token
- `PUT /api/user` — Update user profile (protected)
- `PUT /api/user/password` — Change password (protected)
- `GET /api/user/notes` — Get user's notes (protected)
- `GET /api/notes` — Get all notes (protected)
- `POST /api/notes` — Create a note (protected)
- `PUT /api/notes/:noteId` — Update a note (protected)
- `DELETE /api/notes/:noteId` — Delete a note (protected)
- `PUT /api/notes/restore/:noteId` — Restore a deleted note (protected)

## Project Structure

```
src/
  ├── controllers/    # Route handlers for auth, user, and notes
  ├── middleware/     # JWT authentication middleware
  ├── routes/         # Express route definitions
  ├── index.ts        # App entry point
prisma/
  ├── schema.prisma   # Prisma schema
  └── migrations/     # Database migrations
.env                  # Environment variables
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

**Need help?**  
If you have any questions or issues, feel free to open an issue or email me.

Contacts - [Email me](mailto:bankcash1450@gmail.com)

## Author

Made by [Brian Njoroge](https://github.com/briannjoroge)

Happy coding mate!!
