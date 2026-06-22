import { supabase } from './supabaseClient';

function getLocation() {
  return localStorage.getItem('chaching-location');
}

function toRow(data) {
  return {
    closer: data.closer,
    counts: data.counts,
    total_amount: data.totalAmount,
    safe_amount: data.safeAmount,
    revenue_amount: data.revenueAmount,
    closing_instructions: data.closingInstructions ?? null,
  };
}

function fromRow(row) {
  return {
    id: row.id,
    closer: row.closer,
    counts: row.counts,
    totalAmount: row.total_amount,
    safeAmount: row.safe_amount,
    revenueAmount: row.revenue_amount,
    closingInstructions: row.closing_instructions,
    timestamp: row.timestamp,
    date: row.date,
    location: row.location,
  };
}

class LogService {
  async getAllLogs() {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .eq('location', getLocation())
      .order('timestamp', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(fromRow);
  }

  async getLogsByDate(date) {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .eq('location', getLocation())
      .eq('date', date)
      .order('timestamp', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(fromRow);
  }

  async saveLog(closingData) {
    const { data, error } = await supabase
      .from('logs')
      .insert({ ...toRow(closingData), location: getLocation() })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return fromRow(data);
  }

  async updateLog(id, updatedData) {
    const { data, error } = await supabase
      .from('logs')
      .update(toRow(updatedData))
      .eq('id', id)
      .eq('location', getLocation())
      .select()
      .single();

    if (error) throw new Error(error.message);
    return fromRow(data);
  }

  async deleteLog(id) {
    const { data, error } = await supabase
      .from('logs')
      .delete()
      .eq('id', id)
      .eq('location', getLocation())
      .select()
      .single();

    if (error) throw new Error(error.message);
    return fromRow(data);
  }
}

export const logService = new LogService();
