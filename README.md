# Simple E-Commerce Website

A full-stack e-commerce application with a customer-facing store and an admin dashboard, built with React and Supabase.

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/Y4nno/simple-ecommerce.git
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

5. Open the localhost in your browser.

### Database Setup

This project expects the following Supabase tables: `Product`, `Category`, `Order`, `Order_Item`. Run the schema and RLS policies from `/supabase` in this repo (or recreate the four tables per the ER structure below) before running the app.

## Database Schema

- **Category** — Category_ID (PK), Name, Description
- **Product** — Product_ID (PK), Category_ID (FK), Name, Price, Stock_Qty, Status, Image_URL, Description
- **Order** — Order_ID (PK), Order_Number, Customer_Name, Customer_Email, Customer_Contact, Delivery_Address, Payment_Method, Status, Notes, Total_Amount, Created_At
- **Order_Item** — Order_Item_ID (PK), Order_ID (FK), Product_ID (FK), Quantity, Price_At_Purchase




