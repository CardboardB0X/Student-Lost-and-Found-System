# Campus Lost and Found Web Application (LostRadar) — DCIT 26

An academic-grade, mobile-first full-stack **MERN (MongoDB, Express.js, React 18, Node.js)** single-page web application engineered for the university community to streamline reporting, indexing, discovery, custody tracking, and claiming of lost and found campus assets.

Inspired by **Fireart Studio's neo-mobile UI design system** (obsidian glassmorphism, pulsing radar telemetry, tactile squircle category carousel, curved mobile thumb dock, and slide-up action sheets).

---

## 🌐 Live Production Deployment

* **Primary Production URL**: [https://lostradar-cvsu.vercel.app](https://lostradar-cvsu.vercel.app)
* **Alternative University Domain**: [https://cvsu-lost-and-found.vercel.app](https://cvsu-lost-and-found.vercel.app)
* **Cloud Database**: MongoDB Atlas (Dedicated Serverless Cluster, AWS Region)
* **API Health Check**: [https://lostradar-cvsu.vercel.app/api/health](https://lostradar-cvsu.vercel.app/api/health)

---

## 🎯 Project Proposal & Planning

### 1. Problem Statement
In large collegiate environments (e.g., Cavite State University), students, faculty, and administrative staff frequently misplace personal items (IDs, student badges, calculators, tumblers, laptops, keys). Lost property currently gets scattered across disparate bulletin boards, department desks, physical guard houses, and informal group chats. This fragmented process results in low recovery rates, unverified claims, lack of custodian accountability, and unclaimed items accumulating in physical offices.

### 2. Target Users
1. **Students**: Can instantly search the catalog, view live radar telemetry of items in custody, report lost possessions, and file claims with verifiable identification.
2. **Faculty & Staff**: Can log items found in classrooms or academic halls, attach custody details, and monitor recovery progress.
3. **Campus Safety & Security Personnel**: Can manage custody locations, review claimant proof notes, mark items as turned-in or claimed, and maintain an organized chain of custody.

### 3. Project Objectives
* **Objective 1**: Develop a responsive, mobile-first React SPA with dynamic routing, real-time telemetry, filterable category carousels, and instant search feedback.
* **Objective 2**: Implement an Express.js REST API with robust JSON middleware, sanitized error handling, and strict HTTP status code enforcement (200, 201, 400, 404, 500).
* **Objective 3**: Design a persistent MongoDB Atlas schema via Mongoose enforcing data validation, blind proof verification fields, and tamper-resistant audit timestamps.
* **Objective 4**: Deploy the full-stack architecture to production on Vercel with serverless connection caching and 100% cloud uptime.

### 4. Scope & Boundary
* **In-Scope**:
  * Unified Lost & Found ledger with category, status, and text search filters.
  * Controlled form submission with real-time client-side validation.
  * Role-based simulated authentication (Student, Faculty, Security Officer).
  * One-click claim filing, verification notes, and status transitions (`Reported` $\rightarrow$ `Turned In to Office` $\rightarrow$ `Claimed`).
  * Automated smart matching comparing lost reports against items currently in holding.
  * Mobile thumb dock with elevated quick-action trigger (`+`).
* **Out-of-Scope (Future Work)**:
  * Hardware biometric fingerprint scanners for claiming.
  * Physical smart lockers with IoT automated door relays.

---

## 🚀 Technical Stack & Architecture

| Layer | Technology | Version / Spec | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^18.3.1` | Declarative, component-driven UI with state & hooks |
| **Build Tool** | Vite | `^6.0.0` | Ultra-fast HMR and production chunk bundling |
| **Client Routing** | React Router DOM | `^6.28.0` | Client-side SPA navigation & dynamic detail views (`/items/:id`) |
| **Styling & Icons** | Tailwind CSS & Lucide React | `^3.4.15` / `^0.460.0` | Neo-mobile obsidian theme, responsive utilities, icons |
| **Backend Framework** | Node.js / Express.js | `v20+` / `^4.21.2` | REST API routes, JSON body parsers, CORS middleware |
| **Database & ODM** | MongoDB & Mongoose | `^8.8.4` | Document-oriented cloud database with strict validation schemas |
| **Authentication** | JWT & Bcrypt.js | `^9.0.3` / `^3.0.3` | Secure password hashing and tokenized auth sessions |
| **Cloud Hosting** | Vercel Serverless | Native Functions | Zero-downtime global CDN and serverless API execution |
| **Cloud Database** | MongoDB Atlas | Free M0 Cluster | 24/7 cloud persistence, automatic failover |

---

## 📁 Project Directory Structure

```text
Student Lost and Found System/
├── api/
│   └── index.js                 # Vercel serverless entrypoint bridging Express
├── client/
│   ├── index.html               # SPA entry point with responsive viewport
│   ├── package.json             # Frontend dependencies (React, Vite, Router)
│   ├── vite.config.js           # Vite config with local development proxy
│   ├── tailwind.config.js       # Custom animations, colors, and shadows
│   ├── postcss.config.js
│   ├── public/
│   │   └── sample-items/        # Realistic photos for campus items
│   └── src/
│       ├── main.jsx             # React DOM root render
│       ├── App.jsx              # Navigation routes & layout wrapper
│       ├── index.css            # Tailwind directives & glassmorphic styles
│       ├── context/
│       │   └── AuthContext.jsx  # User session & authentication provider
│       ├── components/
│       │   ├── Navbar.jsx       # Top navigation & mobile thumb dock
│       │   ├── ItemCard.jsx     # Tactile glassmorphic item cards
│       │   ├── StatusBadge.jsx  # Dynamic status chips with aura glow
│       │   ├── LoadingSkeleton.jsx # Pulse skeleton loading states
│       │   └── ErrorAlert.jsx   # Error banner with retry trigger
│       └── pages/
│           ├── ItemListPage.jsx # Main catalog with search & category carousel
│           ├── ItemDetailPage.jsx # Dynamic single asset review & claim flow
│           ├── ItemFormPage.jsx # Controlled form to log or edit property
│           ├── LoginPage.jsx    # 1-Click university demo login & credential auth
│           ├── RegisterPage.jsx # Student & faculty account onboarding
│           ├── MyActivityPage.jsx # Personal tracking of reported & claimed items
│           └── NotFoundPage.jsx # 404 catch-all with redirection
├── server/
│   ├── .env.example             # Template for required environment variables
│   ├── package.json             # Backend dependencies (Express, Mongoose, JWT)
│   ├── server.js                # Express app configuration & middleware
│   ├── seed.js                  # Automated database seed script
│   ├── config/
│   │   └── db.js                # Serverless-cached Mongoose connection
│   ├── middleware/
│   │   └── auth.js              # Protected route & JWT token verification
│   ├── models/
│   │   ├── LostFoundItem.js     # Strict Mongoose schema with validation
│   │   └── User.js              # User schema with bcrypt password hashing
│   ├── controllers/
│   │   ├── authController.js    # Register, login, and get current user
│   │   └── itemController.js    # Full CRUD, filtering, search, and matching
│   └── routes/
│       ├── authRoutes.js        # /api/auth routes
│       └── itemRoutes.js        # /api/items routes
├── vercel.json                  # Vercel routing, build commands, and rewrites
├── test_suite.js                # Automated 10-point test suite for API verification
├── .env.example                 # Root environment variable template
├── .gitignore                   # Ignores .env, node_modules, and build outputs
└── package.json                 # Workspace manager with concurrently dev scripts
```

---

## ⚙️ Environment Variables Reference

Never commit `.env` or production credentials to source control. The repository includes `.env.example` as a template:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | Local Express listening port | `5000` |
| `MONGO_URI` | MongoDB Atlas SRV URI or local database path | `mongodb+srv://user:pass@cluster.mongodb.net/campus_lost_found?retryWrites=true&w=majority` |
| `NODE_ENV` | Runtime environment mode | `development` or `production` |
| `JWT_SECRET` | Secret key for signing and verifying JSON Web Tokens | `lostradar_academic_jwt_secret_key_2026_dcit26` |

---

## 🏃 Installation & Local Execution

### Prerequisites
* **Node.js**: v18.0.0 or higher (v20+ recommended)
* **npm**: v9.0.0 or higher
* **MongoDB**: A free MongoDB Atlas cluster OR local MongoDB instance running at `mongodb://127.0.0.1:27017`

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/CardboardB0X/Student-Lost-and-Found-System.git
   cd Student-Lost-and-Found-System
   ```

2. **Install Workspace Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create `.env` in the root and `server/.env` with your MongoDB connection string:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/campus_lost_found?retryWrites=true&w=majority
   NODE_ENV=development
   JWT_SECRET=lostradar_academic_jwt_secret_key_2026_dcit26
   ```

4. **Seed Database with Sample Campus Records**:
   ```bash
   npm run seed
   ```
   *Populates the database with 6 Cavite State University demo accounts (students, professors, officers) and 12 campus lost/found items with realistic photos.*

5. **Run the Application Locally**:
   ```bash
   npm run dev
   ```
   *Uses `concurrently` to spin up both the Express API (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) simultaneously.*

---

## 📡 REST API Specification

Base Production URL: `https://lostradar-cvsu.vercel.app/api`

| Method | Endpoint | Query / Body Parameters | Description | Status Code |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | None | Service heartbeat and database connection status | `200 OK` |
| `GET` | `/api/items` | `?category=`, `?status=`, `?search=`, `?itemType=` | Fetch items with multi-parameter filtering and text search | `200 OK` |
| `GET` | `/api/items/:id` | Route param: `id` (MongoDB ObjectId) | Fetch full details for a specific item | `200 OK` |
| `POST` | `/api/items` | JSON body (`title`, `category`, `description`, `locationFound`, `custodyLocation`, `itemType`) | Log a newly found or lost campus asset | `201 Created` |
| `PUT` | `/api/items/:id` | JSON body (`status`, `custodyLocation`, `claimRecord`, etc.) | Update an item's status, edit details, or record a claim | `200 OK` |
| `DELETE` | `/api/items/:id` | Route param: `id` (MongoDB ObjectId) | Permanently remove a record from the database | `200 OK` |
| `GET` | `/api/items/:id/matches` | Route param: `id` | Smart match comparison between lost and found entries | `200 OK` |
| `POST` | `/api/auth/register` | JSON body (`name`, `studentId`, `email`, `password`, `role`) | Register a new student or faculty account | `201 Created` |
| `POST` | `/api/auth/login` | JSON body (`identifier`, `password`) | Authenticate user and receive JWT bearer token | `200 OK` |
| `GET` | `/api/auth/me` | Header: `Authorization: Bearer <token>` | Retrieve profile and activity for authenticated user | `200 OK` |

---

## 🧪 Testing Evidence & Quality Verification

An automated verification test script ([`test_suite.js`](./test_suite.js)) was executed directly against the live production deployment. All 10 test scenarios completed successfully:

```text
=== DCIT 26 FULL CRUD & BEHAVIOR TEST SUITE ===

Test 1  [Health Check]              : PASS (HTTP 200)
Test 2  [GET All Items]             : PASS (HTTP 200, Count: 12)
Test 3  [POST Create Record]        : PASS (HTTP 201, Created ID: 6aeecc78ddc7a945bc5de6d0)
Test 4  [POST Invalid Input (400)]  : PASS (HTTP 400, Error: "Validation Error")
Test 5  [GET Single Item by ID]     : PASS (HTTP 200)
Test 6  [PUT Update Item Status]    : PASS (HTTP 200, New Status: "Turned In to Office")
Test 7  [GET Missing Record (404)]  : PASS (HTTP 404, Message: "Lost and found item not found")
Test 8  [GET Empty Filter Results]  : PASS (HTTP 200, Count: 0)
Test 9  [DELETE Record (CRUD)]      : PASS (HTTP 200, Message: "Item deleted successfully")
Test 10 [Verify Deletion (404)]     : PASS (HTTP 404)

=== ALL 10 TESTS PASSED SUCCESSFULLY ===
```

### Key Behaviors Verified
1. **Proper HTTP Status Codes**: 201 for asset creation, 400 for missing mandatory fields (`title`, `category`), 404 for non-existent or deleted IDs, 200 for successful updates and retrievals.
2. **Data Sanitization**: Backend catches database errors without exposing internal stack traces, system paths, or database credentials.
3. **Cloud Persistence**: Records created through the React client persist in the MongoDB Atlas cloud cluster across serverless cold starts and restarts.

---

## 📱 Mobile Responsiveness & Viewport Optimization

* **Responsive Breakpoints**: Seamlessly scales across mobile (375px), tablet (768px), and desktop (1024px+).
* **Touch Targets**: All interactive elements (pills, dock buttons, form inputs, modal controls) meet the $\ge 44 \times 44\text{px}$ accessibility standard.
* **Thumb-Friendly Navigation**: Bottom mobile dock provides immediate 1-tap access to Catalog, Search, My Activity, and the elevated (`+`) report action.

---

## 👥 University Demo Accounts (Pre-Seeded)

For presentation and evaluation, sign in using any of the following accounts (password for all: `password123`):

* **Student Account**: `emmanuel.creo@cvsu.edu.ph` (`2024-10101`)
* **Student Account**: `vonarvin.apilado@cvsu.edu.ph` (`2024-10202`)
* **Faculty Account**: `rai.acosta@cvsu.edu.ph` (`PROF-001`)
* **Faculty Account**: `adrian.sanchez@cvsu.edu.ph` (`PROF-002`)
* **Campus Security Officer**: `andersen.avellana@cvsu.edu.ph` (`SEC-001`)

---

## 🛠️ Maintenance & Extension Notes

* **Updating Categories**: New campus item categories can be added directly to the `CATEGORIES` array in `client/src/pages/ItemListPage.jsx` and the corresponding Mongoose enum in `server/models/LostFoundItem.js`.
* **Database Scaling**: Connected to MongoDB Atlas Serverless; automatically scales storage and bandwidth with zero required downtime.
* **Vercel Deployments**: Any commit pushed to the `main` branch will automatically trigger an incremental production deployment on Vercel.

---

*Cavite State University (CvSU) &bull; Department of Computer Studies &bull; DCIT 26 Final Project*
