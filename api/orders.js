// api/orders.js
import { createClient } from '@supabase/supabase-js';
import sendOrderNotification from '../utils/email.js'; // Ensure the path is correct

const supabaseUrl = process.env.SUPABASE_URL;       // Server-side Supabase URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Server-side Supabase key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Submission of a new order
    const orderData = req.body;
    try {
      // Insert order data into the 'orders' table
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select(); // Returns the inserted order(s)
      if (error) throw error;

      // Send email alert with the inserted order details
      if (data && data.length > 0) {
        // Optionally log the new order details
        console.log('New Order Inserted:', data[0]);
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
    // Fetching orders for the admin dashboard
    try {
      const { data, error } = await supabase
        .from('orders')
        .select();
      if (error) throw error;

      // Transform snake_case keys to camelCase keys expected by the dashboard.
      const ordersCamelCase = data.map(order => ({
        _id: order.id,  // Assuming Supabase returns `id` or you can use `order._id` if already present
        customerName: order.customer_name,
        email: order.customer_email,
        address: order.customer_address,
        totalPrice: order.total,
        transactionId: order.transaction_id,
        status: order.order_status,
        paymentStatus: order.payment_status || 'pending',
        items: order.order_details,
        createdAt: order.created_at,
      }));
      return res.status(200).json({ orders: ordersCamelCase });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}