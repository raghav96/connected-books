import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get('book_id');

  if (!bookId) {
    return NextResponse.json({ error: 'Missing book_id parameter' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://rgjkrflnxopeixwpsjae.supabase.co/functions/v1/graph?book_id=${bookId}`, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnamtyZmxueG9wZWl4d3BzamFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MDg1MzAsImV4cCI6MjAzMzM4NDUzMH0.d40jU9GnAyyRugrgmKZeS9aTfAi1_tBCeHzOulyfMAM',
        'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnamtyZmxueG9wZWl4d3BzamFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MDg1MzAsImV4cCI6MjAzMzM4NDUzMH0.d40jU9GnAyyRugrgmKZeS9aTfAi1_tBCeHzOulyfMAM'
      }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching graph data:', error);
    return NextResponse.json({ error: 'Error fetching graph data' }, { status: 500 });
  }
}
