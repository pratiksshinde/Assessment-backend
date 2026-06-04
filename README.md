# Investment Platform — Backend 

A REST API where corporate users post investment deals and investors can browse them, get personalized recommendations, and invest.

---

## Tech Stack
- Node.js + Express
- PostgreSQL + Sequelize (ORM)
- Redis (caching recommendations)
- JWT (auth)
- bcrypt (password hashing)

---

## Setup

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

Create a `.env` file in the root:

```
PORT=4000
DATABASE_URL=your_postgres_connection_string
REDIS_URL=redis://localhost:6379
JWT_SECRET=some_random_secret_key
```

Start the server:

```bash
node server.js
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Deals
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/deals` | Public |
| GET | `/api/deals/recommended` | Investor only |
| POST | `/api/deals` | Corporate only |
| PUT | `/api/deals/:id` | Corporate (owner) |
| DELETE | `/api/deals/:id` | Corporate (owner) |
| GET | `/api/deals/:id/analytics` | Corporate (owner) |

### Investment
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/deals/:id/invest` | Investor only |

### Investor Preferences
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/preferences` | Investor only |
| GET | `/api/preferences` | Investor only |

---

## Roles
Three roles you set at registration:

- `investor` — browses deals, invests, gets recommendations
- `corporate` — posts and manages deals, sees analytics
- `admin` — reserved for future use

---

## Register example

```json
POST /api/auth/register
{
  "name": "John",
  "email": "john@example.com",
  "password": "secret123",
  "role": "investor"
}
```

## Set investor preferences (required before getting recommendations)

```json
POST /api/preferences
Authorization: Bearer <token>
{
  "riskAppetite": "medium",
  "preferredIndustries": ["tech", "fintech"],
  "budgetMin": 5000,
  "budgetMax": 50000
}
```

---

## Notes
- Deals use soft delete (they're never permanently removed from the database)
- The recommendation engine scores deals based on risk match, industry, budget fit, ROI, and deal popularity
- Concurrent investments are handled safely using database transactions + row locking
- Recommendations are cached in Redis for 10 minutes per user
