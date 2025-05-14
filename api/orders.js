// api/orders.js
import { createClient } from '@supabase/supabase-js';
import sendOrderNotification from '../src/utils/email.js'; // Ensure this path is correct

const supabaseUrl = process.env.SUPABASE_URL;       // Server-side Supabase URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Server-side Supabase key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  const { method } = req;
  // Remove any query string.
  const cleanedUrl = req.url.split('?')[0]; // e.g. "/api/orders/123/confirm-payment" or "/orders/123/confirm-payment"
  // Split the URL path into segments.
  let urlParts = cleanedUrl.split('/').filter((part) => part);

  // Normalize URL parts: if the first element is "api" or "orders", remove it.
  if (urlParts[0] === 'api' || urlParts[0] === 'orders') {
    urlParts.shift();
  }

  // For requests to the base route (i.e., /api/orders)
  if (urlParts.length === 0) {
    if (method === 'GET') {
      try {
        // Use query parameters for pagination if provided.
        // By default, fetch 50 records starting from offset 0.
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
  
        // Select only the needed fields.
        const selectFields = 'id, customer_name, customer_email, customer_address, total, transaction_id, order_status, payment_status, order_details, created_at';
  
        const query = supabase
          .from('orders')
          .select(selectFields)
          .range(offset, offset + limit - 1);
  
        const { data, error } = await query;
        if (error) throw error;
  
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
      // Process new order submission.
      const orderData = req.body;
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert(orderData)
          .select();
        if (error) throw error;
        console.log('New order inserted:', data);
  
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
  
  // For endpoints with an order ID (such as /api/orders/:orderId or /api/orders/:orderId/confirm-payment)
  if (urlParts.length >= 1) {
    const orderId = urlParts[0];
  
    if (method === 'PUT') {
      if (urlParts.length === 2 && urlParts[1] === 'confirm-payment') {
        // Confirm payment endpoint.
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
        // Update order status endpoint.
        const { status } = req.body;
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
      // Delete order endpoint.
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
  
  // Fallback.
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${method} not allowed` });
}