// api/analytics.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
  try {
    // Pull the orders with their "total" and "created_at" fields.
    const { data, error } = await supabase.from('orders').select('total, created_at');
    if (error) throw error;

    // Aggregate revenue by date.
    const revenueMap = {};
    data.forEach(order => {
      // Group by the localized date string; adjust this as needed.
      const date = new Date(order.created_at).toLocaleDateString();
      revenueMap[date] = (revenueMap[date] || 0) + order.total;
    });

    // Sort the dates and map their revenue.
    const dates = Object.keys(revenueMap).sort((a, b) => new Date(a) - new Date(b));
    const revenue = dates.map(date => revenueMap[date]);

    return res.status(200).json({ dates, revenue });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}