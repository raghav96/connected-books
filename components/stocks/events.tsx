"use client";

import { useState } from 'react';
import { GraphComponent } from './graph-component';

interface Event {
  book_id: string;
  author: string;
  title: string;
  metadata: string;
}

interface EventsProps {
  props: Event[];
}

export function Events({ props: events }: EventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="relative -mt-2 flex w-full flex-col gap-2 py-4">
      {events.map((event, index) => (
        <div
          key={index}
          className="flex shrink-0 flex-col gap-1 rounded-lg bg-zinc-800 p-4"
        >
          <div className="flex justify-between">
            <div className="text-sm text-zinc-400">{event.author}</div>
            <button onClick={() => handleEventClick(event)} className="text-zinc-400">
              <i className="fas fa-chart-bar"></i> {/* FontAwesome Graph Icon */}
            </button>
          </div>
          <div className="text-base font-bold text-zinc-200">{event.title}</div>
          <div className="text-zinc-500">{event.metadata}...</div>
        </div>
      ))}
      {selectedEvent && <GraphComponent event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}
