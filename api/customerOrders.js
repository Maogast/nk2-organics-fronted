// api/customerOrders.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
  
  const customerEmail = req.headers['x-customer-email'];
  
  if (!customerEmail) {
    return res.status(400).json({ error: 'Missing x-customer-email header' });
  }
  
  try {
    const { data, error } = await supabase.from('orders').select();
    if (error) throw error;
    
    // Filter orders by the logged-in customer's email
    const customerOrders = (data || []).filter(order => order.customer_email === customerEmail);
    
    // Transform from snake_case to camelCase for frontend use
    const ordersCamelCase = customerOrders.map(order => ({
      _id: order.id,
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}