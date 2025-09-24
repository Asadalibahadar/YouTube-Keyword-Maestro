
import React from 'react';

const Welcome: React.FC = () => {
  return (
    <div className="text-center max-w-4xl mx-auto p-8 bg-gray-800/50 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-gray-200 mb-4">Welcome to Your YouTube Strategy Hub</h2>
      <p className="text-gray-400 mb-6">
        Ready to find your next hit video idea? Enter a topic above to generate 100 keyword ideas.
        Then, use the advanced controls to select your target country, filter by volume and competition, sort your results, and export your data.
      </p>
      <div className="grid md:grid-cols-3 gap-4 text-left">
        <div className="bg-gray-700/50 p-4 rounded-md">
            <h3 className="font-semibold text-purple-400">Geo-Targeting</h3>
            <p className="text-sm text-gray-400 mt-1">Select a country to get region-specific search volume and competition data.</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-md">
            <h3 className="font-semibold text-pink-400">Advanced Filtering</h3>
            <p className="text-sm text-gray-400 mt-1">Filter by word count, search volume, and competition to narrow down your results.</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-md">
            <h3 className="font-semibold text-red-400">Sort & Export</h3>
            <p className="text-sm text-gray-400 mt-1">Click any table header to sort your list and export your final keywords to a CSV file.</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
