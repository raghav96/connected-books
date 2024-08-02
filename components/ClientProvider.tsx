"use client";

import { useState } from 'react';
import SearchBar from '@/components/searchBar';
import Graph from '@/components/Graph';

const ClientProvider = ({ children }) => {
  const [selectedBookId, setSelectedBookId] = useState(null);

  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
  };

  return (
    <div className="flex flex-col flex-1 bg-muted/50">
      <SearchBar onSelectBook={handleSelectBook} />
      {children}
      {selectedBookId && <Graph bookId={selectedBookId} />}
    </div>
  );
};

export default ClientProvider;

