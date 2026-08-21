# 🌱 AerthX — Carbon Credit MarketplaceHero Platform


AerthX is a full-stack carbon credit MarketplaceHero designed to help individuals and organizations offset their carbon footprint by purchasing verified carbon credits from real-world environmental projects.

The platform provides a complete ecosystem including:

* MarketplaceHero for carbon credits
* Subscription-based access to features
* Enterprise-level dashboards
* Payment integration
* Admin control panel for dynamic pricing & feature management

---

# 🚀 Vision

AerthX aims to simplify access to carbon credits and make sustainability actionable for businesses and individuals by providing:

* Transparent pricing
* Easy purchase flows
* Real-time tracking
* Scalable enterprise features

---

# 🧠 System Architecture

AerthX is built using a **multi-frontend + centralized backend architecture**.

```
Frontend Layer (3 Apps)
│
├── Client (Landing / Public Website)
├── MarketplaceHero (User Platform)
├── Admin Panel (Control System)
│
Backend (Server)
│
└── Node.js + Express + MongoDB API
```

---

# 📦 Project Structure

```
admin-frontend/   → Admin dashboard (pricing + features control)
client/           → Public landing website
MarketplaceHero/      → Main user application (dashboard + payments)
server/           → Backend API (auth, payments, pricing, subscriptions)
```

---

# 🌐 Frontend Applications

## 1️⃣ Client (Public Website)

Purpose:

* Landing page
* Marketing
* Entry point for users

Features:

* Homepage UI
* Pricing preview
* Navigation to MarketplaceHero
* Static content

Tech:

* React (Vite)
* Tailwind CSS

---

## 2️⃣ MarketplaceHero (Main Application)

Purpose:

* Core product interface for users

Features:

* User authentication (individual & organization)
* Carbon credit MarketplaceHero
* Subscription plans (Basic, Pro, Custom)
* Payment integration (Razorpay)
* Dashboard (Overview, Certificates, Transactions)
* Feature-based access control
* Dynamic pricing display
* Subscription status tracking

Tech:

* React (Vite)
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Axios

---

## 3️⃣ Admin Frontend

Purpose:

* Internal control system for business logic

Features:

* Dynamic pricing management
* Plan creation (Basic / Pro / Custom)
* Feature toggling per plan
* Feature group creation
* Real-time system configuration

Tech:

* React
* Tailwind CSS
* Axios

---

# ⚙️ Backend (Server)

Core API that powers all frontend applications.

## Features:

* Authentication (JWT-based)
* User management (individual & organization)
* Subscription system
* Pricing configuration (dynamic)
* Feature management system
* Payment processing (Razorpay)
* Subscription verification
* Admin controls
* Notifications
* Contact & bug reporting APIs

---

## 🧱 Tech Stack (Backend)

* Node.js
* Express.js
* MongoDB (Mongoose)
* Razorpay SDK
* JWT Authentication
* REST API architecture

---

# 🧩 Core Backend Modules

## 1. Authentication

* Register / Login
* OTP verification
* Token management

## 2. Subscription System

* Store user subscription
* Track plan (plan_1, plan_2, plan_3)
* Monthly / yearly billing
* Status (active, expired)

## 3. Pricing Engine (Dynamic)

Stored in MongoDB:

* Plans (Basic, Pro, Custom)
* Monthly & yearly prices
* Feature mapping per plan

Example:

```
plans: {
  plan_1: { features: {...} },
  plan_2: { features: {...} }
}
```

---

## 4. Feature Control System (IMPORTANT)

Admin defines features → system enforces access.

Flow:

1. Admin creates feature (e.g., API Access)
2. Feature assigned to plan
3. User subscription checked
4. FeatureGate allows/blocks UI access

---

## 5. Payment System

Integrated with Razorpay.

Flow:

1. Create order
2. User completes payment
3. Razorpay returns:

   * payment_id
   * order_id
   * signature
4. Backend verifies signature
5. Subscription activated

---

# 💳 Payment Integration

Provider:

* Razorpay

Supported methods:

* UPI (GPay, PhonePe)
* Cards
* Net Banking

---

# 📊 Database Design (MongoDB)

## Collections:

### Users

* user info
* role (individual / organization)

### Subscriptions

* userId
* plan
* billing type
* startDate
* endDate
* status

### PricingConfig

* plans
* features
* featureGroups

### Transactions

* payment data
* razorpay ids

### Notifications

* system alerts

---

# 🔐 Feature-Based Access System

Access is controlled dynamically:

```
User → Subscription → Plan → Features → UI Access
```

Example:

* Basic → no API access
* Pro → API access enabled

---

# 🎯 Key Highlights

* Dynamic pricing (no hardcoding)
* Multi-role system (individual + organization)
* Modular frontend architecture
* Admin-controlled feature system
* Scalable SaaS-ready design

---

# ⚙️ Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_key
```

### Backend (.env)

```
PORT=5000
MONGO_URI=your_mongo_url
RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret
```

---

# 🧪 Running the Project

## 1. Clone Repo

```
git clone https://github.com/your-username/AerthX.git
```

## 2. Install Dependencies

```
cd server
npm install

cd ../MarketplaceHero
npm install

cd ../admin-frontend
npm install
```

## 3. Run Servers

```
npm run dev
```

---

# 📌 Future Improvements

* Carbon credit verification system
* Blockchain integration (optional future)
* Advanced analytics dashboard
* Enterprise API monetization
* Referral system
* AI-based sustainability insights


# 🏁 Conclusion

AerthX is a scalable carbon credit SaaS platform with a strong foundation in:

* dynamic pricing
* feature-based architecture
* subscription-based monetization

It is designed to evolve into a full enterprise-grade sustainability platform.



## Marketplace development data

The Marketplace is database-driven. Start the backend with a valid `server/.env`, then populate realistic demo carbon-credit projects with:

```bash
cd server
npm run seed:carbon
```

To reset only the demo projects and recreate them:

```bash
npm run seed:carbon:reset
```
