"use client";

import { useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import axios from 'axios';

const SearchBar = ({ onSelectBook }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/search', { input: searchQuery });
      setResults(response.data.top10Books || []);
      console.log("Search results:", response.data.top10Books);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <div>
      <form className='flex justify-center mt-12 w-2/3 sm:w-3/5 lg:w-1/3 mx-auto' onSubmit={onSearch}>
        <input
          className='px-5 py-1 w-full sm:px-5 sm:py-3 text-white bg-zinc-800 border-2 rounded-full outline-none focus:border-black'
          placeholder='What are you looking for?'
          onChange={e => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <button type="submit" className="ml-2">
          <IoSearchOutline className="text-2xl"/>
        </button>
      </form>
      <div className="mt-8 flex flex-col w-[90%] items-center mx-auto">
        {results.length > 0 && (
          <ul className="space-y-2">
            {results.map((book, index) => (
              <li 
                key={index} 
                className="p-4 border rounded-md shadow cursor-pointer" 
                onClick={() => onSelectBook(book.id)}
              >
                <p><strong>Title:</strong> {book.metadata.title}</p>
                <p><strong>Summary:</strong> {book.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
