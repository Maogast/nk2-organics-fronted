// api/orders.js
import { createClient } from '@supabase/supabase-js';
import sendOrderNotification from '../utils/email.js'; // Make sure the path is correct

const supabaseUrl = process.env.SUPABASE_URL;       // Set in your Vercel/local environment
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Set similarly

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  
  // Parse the order data from the request body.
  const orderData = req.body;

  try {
    // Insert order data into the 'orders' table in Supabase and return the inserted row(s)
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select();
    
    if (error) throw error;

    // If insertion is successful and data is returned, send an email notification via Nodemailer.
    if (data && data.length > 0) {
      sendOrderNotification(data[0]).catch(notificationError => {
        console.error('Error sending notification:', notificationError);
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Order Insertion Error:', error);
    return res.status(500).json({ error: error.message });
  }
}