// api/analytics.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  console.log("Analytics endpoint received method:", req.method);
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
  try {
    // Pull orders with "total" and "created_at"
    const { data, error } = await supabase.from('orders').select('total, created_at');
    if (error) throw error;
    
    console.log("Fetched orders for analytics:", data);
    
    // Aggregate revenue by date.
    const revenueMap = {};
    data.forEach(order => {
      try {
        const date = new Date(order.created_at).toLocaleDateString();
        revenueMap[date] = (revenueMap[date] || 0) + order.total;
      } catch (e) {
        console.error("Error processing order:", order, e);
      }
    });
    
    const dates = Object.keys(revenueMap).sort((a, b) => new Date(a) - new Date(b));
    const revenue = dates.map(date => revenueMap[date]);
    
    return res.status(200).json({ dates, revenue });
  } catch (err) {
    console.error("Analytics error:", err);
    return res.status(500).json({ error: err.message });
  }
}