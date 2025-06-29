# ScholaFlow Backend

A REST API backend for ScholaFlow, the learning platform that enhances educational experiences. Built with Express.js, TypeScript, and PostgreSQL.

![scholaflow og](https://github.com/user-attachments/assets/413b1771-8ca9-49fb-8d79-9d446430334f)

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/) v20+
- **Framework:** [Express.js](https://expressjs.com/) v5
- **Language:** [TypeScript](https://www.typescriptlang.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/))
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Validation:** [Zod](https://zod.dev/)
- **Authentication:** Session-based auth with Bearer tokens
- **Development:** [Nodemon](https://nodemon.io/), [ts-node](https://typestrong.org/ts-node/)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm or yarn
- A Supabase account and project
- Database URL from Supabase

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/LuisCabantac/scholaflow-backend.git
   cd scholaflow-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory:

   ```env
   DATABASE_URL="your-supabase-database-url"
   FRONTEND_APP_URL="https://scholaflow.vercel.app"
   LOCALHOST_APP_URL="http://localhost:3000"
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:8080`

## CORS Configuration

The backend is configured to accept requests from:

- Production: `https://scholaflow.vercel.app`
- Development: `http://localhost:3000`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-endpoint`
3. Make your changes following the existing code patterns
4. Ensure proper error handling and validation
5. Test your changes thoroughly
6. Submit a pull request

## Related Projects

- **Frontend:** [ScholaFlow Frontend](https://github.com/LuisCabantac/scholaflow)
- **Live Demo:** [https://scholaflow.vercel.app](https://scholaflow.vercel.app)
