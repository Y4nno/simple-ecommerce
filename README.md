# Simple E-Commerce Website

A full-stack e-commerce application with a customer-facing store and an admin dashboard, built with React and Supabase.

## Live Links

- **Customer Website:** [PASTE_LIVE_CUSTOMER_URL_HERE]
- **Admin Dashboard:** [PASTE_LIVE_URL_HERE]/admin/login
- **GitHub Repository:** [PASTE_GITHUB_REPO_URL_HERE]

## Admin Login Credentials

- **Email:** admin@admin.com
- **Password:** 123123

## Technologies Used

- **Frontend:** React (Vite), React Router
- **Backend / Database:** Supabase (PostgreSQL, Row Level Security, Auth)
- **State Management:** React Context API (Cart, Admin Auth)
- **Styling:** Custom CSS
- **Persistence:** Supabase (products, orders) + localStorage (cart, order tracking)

## Tech Stack Rationale

- **React + Vite** for a fast, component-based frontend with hot reload during development.
- **Supabase** as an all-in-one backend: Postgres database, auto-generated REST API, real authentication, and Row Level Security — avoided building a custom Node/Express backend given the timeline.
- **Context API** for cart and admin-auth state, since both need to be accessible from multiple unrelated components (product cards, cart page, checkout, admin sidebar) without prop-drilling.
- **localStorage** for cart persistence (per requirement) and lightweight "My Orders" tracking on the customer side, since the assessment does not require customer accounts.

## Setup Instructions

1. Clone the repository:
   ```
   git clone [YOUR_REPO_URL]
   cd ecommerce-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root with your own Supabase project credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open `http://localhost:5173` in your browser.

### Database Setup

This project expects the following Supabase tables: `Product`, `Category`, `Order`, `Order_Item`. Run the schema and RLS policies from `/supabase` in this repo (or recreate the four tables per the ER structure below) before running the app.

## Database Schema

- **Category** — Category_ID (PK), Name, Description
- **Product** — Product_ID (PK), Category_ID (FK), Name, Price, Stock_Qty, Status, Image_URL, Description
- **Order** — Order_ID (PK), Order_Number, Customer_Name, Customer_Email, Customer_Contact, Delivery_Address, Payment_Method, Status, Notes, Total_Amount, Created_At
- **Order_Item** — Order_Item_ID (PK), Order_ID (FK), Product_ID (FK), Quantity, Price_At_Purchase

## System Flow

**Customer side:**
1. Customer browses products on the Home page (featured picks) or the full Product Listing page (search, filter by category, sort by price).
2. Clicking a product opens its Details page, showing full info, a quantity selector, and related products from the same category.
3. Adding to cart stores the item in a shared Cart Context, persisted to `localStorage` so it survives page refresh.
4. On the Cart page, the customer can adjust quantities, remove items, and see a live total before proceeding to Checkout.
5. Checkout collects customer and delivery info, writes a new row to the `Order` table and corresponding rows to `Order_Item`, then shows a confirmation screen with a generated order number.
6. The order number is also saved to `localStorage` so the customer can revisit "My Orders" later and see live order status pulled from Supabase.

**Admin side:**
1. Admin logs in via real Supabase Authentication at `/admin/login`.
2. The Dashboard shows live summary stats (products, orders by status, unique customers, total completed sales).
3. Product Management, Category Management, Order Management, and Customer Management each pull live data from Supabase, with full CRUD where applicable (add/edit/delete products and categories, update order status).
4. Category deletion is blocked with a warning if that category is still assigned to any product.
5. Any change made on the admin side (new product, price update, product deactivated, order status changed) is reflected immediately on the customer-facing pages on next load, since both sides read from the same Supabase tables.

## Known Simplifications

Given the assessment timeline, a few deliberate simplifications were made:

- **Admin RLS policies are scoped broadly** (`public` role) rather than tightly to `authenticated`, because simulated/real auth checks happen at the React route level via a `ProtectedRoute` component rather than exclusively through Postgres role-based policies.
- **Customer Management has no dedicated accounts table** — customer records are derived by grouping `Order` rows by email, since the assessment doesn't require customer login/registration. "Status" on this page reflects "has placed at least one order," not a true account status.
- **"My Orders" order tracking** (an optional bonus feature) is `localStorage`-based rather than tied to a real customer account, so it's only visible on the same browser/device that placed the order.
- Category names are joined into product queries using Supabase's relational select syntax (`select('*, Category(Name)')`) rather than a separate lookup table client-side.

## Screenshots

Screenshots (desktop and mobile, customer and admin) are included in the `/screenshots` folder of this repository.
