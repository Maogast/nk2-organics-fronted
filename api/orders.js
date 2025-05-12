// api/orders.js
import { createClient } from '@supabase/supabase-js';
import sendOrderNotification from '../utils/email.js'; // Ensure this path is correct

const supabaseUrl = process.env.SUPABASE_URL;       // Your server-side variable for Supabase URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Your server-side variable for Supabase anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Process new order submission
    const orderData = req.body;

    try {
      // Insert order data into the 'orders' table and return the inserted record
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select(); // This returns the inserted order(s)

      if (error) throw error;

      // If data exists, send an email notification to the admin(s)
      if (data && data.length > 0) {
        sendOrderNotification(data[0]).catch((notificationError) => {
          console.error('Error sending notification email:', notificationError);
        });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('Order Insertion Error:', error);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    // Fetch orders for admin dashboard
    try {
      // Optionally, you might want to verify that the requesting admin is authorized
      // const adminEmail = req.headers['x-admin-email'];
      // Add any admin authorization check here if needed.

      // Fetch orders from the 'orders' table
      const { data, error } = await supabase
        .from('orders')
        .select();

      if (error) throw error;

      return res.status(200).json({ orders: data });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    // Method is not allowed
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}