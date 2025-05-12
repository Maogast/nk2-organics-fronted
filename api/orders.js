// api/orders.js
import { createClient } from '@supabase/supabase-js';
import sendOrderNotification from '../src/utils/email.js'; // Ensure this path is correct

const supabaseUrl = process.env.SUPABASE_URL;       // Server-side Supabase URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Server-side Supabase key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  const { method, url } = req;
  // Remove any query string and split the URL path into segments.
  const cleanedUrl = url.split('?')[0]; // e.g. "/api/orders/123/confirm-payment"
  const urlParts = cleanedUrl.split('/').filter((part) => part);  // e.g. ["api", "orders", "123", "confirm-payment"]

  // If the endpoint is exactly "/api/orders" (i.e. urlParts length is 2)
  if (urlParts.length === 2) {
    if (method === 'GET') {
      // Fetch orders for the admin dashboard
      try {
        const { data, error } = await supabase.from('orders').select();
        if (error) throw error;
        console.log('Fetched raw orders:', data);

        // Transform from snake_case to camelCase for the frontend.
        const ordersCamelCase = (data || []).map((order) => ({
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
    } else if (method === 'POST') {
      // Process new order submission
      const orderData = req.body;
      try {
        // Insert order into Supabase and return the inserted row(s)
        const { data, error } = await supabase
          .from('orders')
          .insert(orderData)
          .select();
        if (error) throw error;
        console.log('New order inserted:', data);

        // Send email notification if insertion was successful.
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
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${method} not allowed on /api/orders` });
    }
  }

  // For endpoints that include an order ID (or extra segments) such as /api/orders/{orderId} or /api/orders/{orderId}/confirm-payment.
  if (urlParts.length >= 3) {
    const orderId = urlParts[2];

    if (method === 'PUT') {
      // Check if the endpoint is for confirming payment.
      if (urlParts.length === 4 && urlParts[3] === 'confirm-payment') {
        try {
          const { data, error } = await supabase
            .from('orders')
            .update({ payment_status: 'confirmed' })
            .eq('id', orderId);
          if (error) throw error;
          return res.status(200).json({ message: 'Payment confirmed', data });
        } catch (error) {
          console.error('Error confirming payment:', error);
          return res.status(500).json({ error: error.message });
        }
      } else {
        // Otherwise, treat it as a normal update (updating order status).
        const { status } = req.body; // Expecting a JSON payload like { "status": "processed" }
        if (!status) {
          return res.status(400).json({ error: 'Missing status in request body' });
        }
        try {
          const { data, error } = await supabase
            .from('orders')
            .update({ order_status: status })
            .eq('id', orderId);
          if (error) throw error;
          return res.status(200).json({ message: 'Order status updated', data });
        } catch (error) {
          console.error('Error updating order status:', error);
          return res.status(500).json({ error: error.message });
        }
      }
    } else if (method === 'DELETE') {
      // Delete an order.
      try {
        const { data, error } = await supabase
          .from('orders')
          .delete()
          .eq('id', orderId);
        if (error) throw error;
        return res.status(200).json({ message: 'Order deleted', data });
      } catch (error) {
        console.error('Error deleting order:', error);
        return res.status(500).json({ error: error.message });
      }
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed on /api/orders/${orderId}` });
    }
  }

  // If no conditions match, return a 405 Method Not Allowed response.
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${method} not allowed` });
}