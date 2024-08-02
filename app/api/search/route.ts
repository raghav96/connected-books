import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const SUPABASE_SEARCH_URL = 'https://rgjkrflnxopeixwpsjae.supabase.co/functions/v1/search';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnamtyZmxueG9wZWl4d3BzamFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MDg1MzAsImV4cCI6MjAzMzM4NDUzMH0.d40jU9GnAyyRugrgmKZeS9aTfAi1_tBCeHzOulyfMAM';

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  try {
    const response = await axios.post(SUPABASE_SEARCH_URL, { input }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json({ error: 'Error fetching search results' }, { status: 500 });
  }
}
