// api/orders.js
import { createClient } from '@supabase/supabase-js';
import sendOrderNotification from '../utils/email.js'; // Ensure this path is correct

const supabaseUrl = process.env.SUPABASE_URL;       // Server-side Supabase URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Server-side Supabase key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Process new order submission
    const orderData = req.body;
    try {
      // Insert order data into the 'orders' table and return inserted record(s)
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select(); // Use .select() to return the newly inserted row(s)

      if (error) throw error;

      // Log the inserted order data for debugging
      console.log('New order inserted:', data);

      // Send email notification if data is returned
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
    // Fetch orders for the admin dashboard
    try {
      const { data, error } = await supabase
        .from('orders')
        .select();
      if (error) throw error;
      console.log('Fetched raw orders:', data);

      // Safely perform transformation: note that our table columns are inserted with snake_case keys.
      const ordersCamelCase = (data || []).map(order => ({
        // In case Supabase uses 'id' as the primary key:
        _id: order.id || order._id,
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