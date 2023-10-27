import React from 'react';

export default function SearchBar({ searchTerm, onSearchTermChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Sök produkter"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
      
    </div>
  );
}

