
import React, { useState } from 'react';

interface KeywordInputProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ onSearch, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(topic);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex items-center bg-gray-800 border-2 border-gray-700 rounded-full shadow-lg overflow-hidden focus-within:border-purple-500 transition-colors duration-300">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a broad topic (e.g., 'React tutorials', 'Keto recipes')..."
          className="w-full bg-transparent p-4 text-gray-200 placeholder-gray-500 focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 text-white font-bold py-2 px-6 m-2 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </form>
  );
};

export default KeywordInput;
