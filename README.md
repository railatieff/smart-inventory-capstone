# Smart Inventory 📦 - AI Product Description Generator

This is a full-stack capstone project demonstrating a "Smart Inventory" module for a modern ERP system, built with a decoupled architecture and powered by IBM's Granite LLM.

## Description

### The Problem

In the world of e-commerce, small and medium-sized enterprise (SME) owners are often experts at creating their products but struggle with marketing them. A common bottleneck is writing **compelling product descriptions**. This task is time-consuming and requires copywriting skills that many owners don't have.

The result is often rushed, generic, or even empty descriptions, which leads to poor customer engagement and lower conversion rates.

### The Solution

This project tackles this problem head-on by building an AI-powered assistant directly into the inventory management workflow.

Instead of staring at a blank text box, the user simply adds a new product with its name and a few keywords (e.g., "Stussy 8-Ball Tee", "Cotton, Black, Size L, Streetwear"). With a single click, the system leverages the **IBM Granite AI** to generate a creative, persuasive, and sales-ready description. This description is then automatically saved to the database, turning a 15-minute writing task into a 15-second automated process.

---

## Technologies Used

This project uses a modern, decoupled, and containerized stack, chosen specifically for scalability and maintainability.

- **Frontend:** **Next.js (React)**

  - **Why:** Chosen for its powerful component-based architecture, which allows us to build a complex, stateful UI (like our product list) efficiently. Its fast performance and optimized builds are perfect for a user-facing dashboard.

- **Backend:** **Node.js + Express**

  - **Why:** A lightweight and high-performance stack for building a **pure JSON API**. Its non-blocking, event-driven nature is ideal for handling concurrent requests, especially for I/O-heavy tasks like querying a database and waiting for a response from an external AI API (Replicate).

- **Database:** **PostgreSQL**

  - **Why:** A robust and reliable open-source relational database. For an ERP system, data integrity is critical. PostgreSQL enforces a strict schema for our `products` table, ensuring all data is structured, consistent, and scalable.

- **AI Model:** **IBM Granite (via Replicate API)**

  - **Why:** A powerful and efficient instruction-following LLM. We chose Granite for its specific strength in understanding context and generating high-quality, creative content from a simple prompt, making it the perfect "engine" for our AI copywriter.

- **Containerization:** **Docker & Docker Compose**
  - **Why:** This is the glue that holds the project together.
    1.  **Consistency:** Docker solves the "it works on my machine" problem by bundling each service (Frontend, Backend, DB) into its own isolated container.
    2.  **Orchestration:** Docker Compose allows us to define and run this complex, multi-service application with a single command (`docker-compose up`), making the entire development and deployment environment 100% reproducible.

---

## Features

### 1. AI-Powered Description Generator (Core Feature)

This is the main feature of the project, demonstrating a practical and high-value use of Generative AI.

- **How it Works:**
  1.  The user adds a product with just a name and keywords.
  2.  The user clicks the **"✨ Generate Description (AI)"** button on the frontend (Next.js).
  3.  The frontend sends a `POST` request to our backend API (`/api/products/:id/generate-description`).
  4.  The backend (Express) retrieves the product's name and attributes from the **PostgreSQL** database.
  5.  It formats this data into a detailed prompt (e.g., "Write a persuasive product description for...") and sends it to the **Replicate API**, specifying the **IBM Granite** model.
  6.  The AI generates the description and sends the raw text back to our backend.
  7.  The backend saves this new description into the correct row in the database.
  8.  The fully updated product (now including the AI description) is sent back to the frontend, which displays it to the user instantly without a page reload.

### 2. Full Product CRUD

The system provides a complete inventory management interface with full CRUD functionality:

- **Create:** Add new products via the main form.
- **Read:** Fetch and display a list of all current products on page load.
- **Update:** This function is seamlessly handled by the AI generation feature.
- **Delete:** Remove products from the database.

### 3. Decoupled (Headless) Architecture

The **Next.js Frontend** (on `localhost:3001`) is completely separate from the **Express Backend** (on `localhost:3000`). They only communicate via JSON. This modern architecture allows the frontend and backend to be developed, scaled, and deployed independently.

---

## AI Support Explanation

**AI is not a gimmick in this project; it is the core solution to the primary business problem.**

- **How it's Used:** We use the IBM Granite LLM as an "on-demand creative copywriter." It is integrated directly into the product management workflow via an API. We don't just ask it a question; we provide it with structured data (name, attributes) and a specific _instruction_ (the prompt) to generate content that fits a precise business need (an e-commerce description).

- **Real-World Impact:**
  1.  **Solves a Major Bottleneck:** It removes the friction that stops a business owner from adding new products. This directly enables faster inventory scaling and business growth.
  2.  **Massive Time Savings:** It automates a 15-minute creative task, reducing it to a 15-second, one-click process.
  3.  **Increases Quality & Consistency:** It ensures _every_ product in the store has a high-quality, professional, and persuasive description, which improves the brand's image and can directly lead to higher sales.

---

## Setup Instructions

### 1. Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- A [Replicate.com](https://replicate.com/) account (to get an API key)

### 2. Clone the Repository

```bash
git clone [https://github.com/raillatieff/smart-inventory-capstone.git](https://github.com/raillatieff/smart-inventory-capstone.git) # GANTI DENGAN URL REPO LU
cd smart-inventory
```

### 3. Create Environment File

Create a `.env` file in the root of the project. Copy the contents of `.env.example` and fill in your details.

```bash
# .env
# Database Config
DB_USER=postgres
DB_PASSWORD=admin
DB_NAME=smart_inventory
DB_HOST=db
DB_PORT=5432

# Server Port
PORT=3000

# Replicate AI API Key
REPLICATE_API_KEY=r8_...YOUR_API_KEY_HERE
```

### 4. Run with Docker (Recommended)

This is the simplest way to run the entire application (Frontend, Backend, and DB).

```bash
docker-compose up --build
```

- Frontend will be available at: `http://localhost:3001`
- Backend API will be available at: `http://localhost:3000`

### 5. Run in Hybrid Local Mode (For Development/Testing)

If Docker is too slow for Next.js on your machine, you can run the services locally while keeping the database in Docker.

**Terminal 1: Run Database (Docker)**

```bash
# Edit .env -> Set DB_HOST=localhost
docker-compose up -d db
```

**Terminal 2: Run Backend (Local)**

```bash
# Edit backend/db.js and backend/aiService.js
# Change require('dotenv').config() to:
# require('dotenv').config({ path: '../.env' })

cd backend
npm install
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 3: Run Frontend (Local)**

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3001
```
