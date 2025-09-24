
import React from 'react';
import { KeywordData } from '../types';

type SortConfig = {
  key: keyof KeywordData;
  direction: 'ascending' | 'descending';
};

interface ResultsTableProps {
  data: KeywordData[];
  onSort: (key: keyof KeywordData) => void;
  sortConfig: SortConfig;
  onGetIdeas: (keyword: KeywordData) => void;
}

const getCompetitionBadge = (score: number) => {
  let color = 'bg-gray-500 text-gray-100';
  let text = 'N/A';

  if (score <= 33) {
    color = 'bg-green-500 text-green-100';
    text = 'Low';
  } else if (score <= 66) {
    color = 'bg-yellow-500 text-yellow-100';
    text = 'Medium';
  } else if (score <= 100){
    color = 'bg-red-500 text-red-100';
    text = 'High';
  }
  
  return { color, text };
};

const SortableHeader: React.FC<{
  columnKey: keyof KeywordData;
  title: string;
  onSort: (key: keyof KeywordData) => void;
  sortConfig: SortConfig;
  className?: string;
}> = ({ columnKey, title, onSort, sortConfig, className }) => {
  const isSorted = sortConfig.key === columnKey;
  const icon = isSorted ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '';
  
  return (
    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${className || ''}`}>
      <button onClick={() => onSort(columnKey)} className="flex items-center space-x-1 focus:outline-none">
        <span>{title}</span>
        <span className="text-purple-400">{icon}</span>
      </button>
    </th>
  );
};


const ResultsTable: React.FC<ResultsTableProps> = ({ data, onSort, sortConfig, onGetIdeas }) => {
  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-2xl animate-fade-in">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700/50">
          <tr>
            <SortableHeader columnKey="keyword" title="Keyword" onSort={onSort} sortConfig={sortConfig} className="w-2/5" />
            <SortableHeader columnKey="searchVolume" title="Monthly Search Volume" onSort={onSort} sortConfig={sortConfig} />
            <SortableHeader columnKey="competition" title="Competition (1-100)" onSort={onSort} sortConfig={sortConfig} />
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {data.map((item, index) => {
            const competitionBadge = getCompetitionBadge(item.competition);
            return (
              <tr key={index} className="hover:bg-gray-700/50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-normal text-sm font-medium text-white">{item.keyword}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {item.searchVolume.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${competitionBadge.color}`}>
                      {competitionBadge.text}
                    </span>
                    <span className="ml-3 text-sm text-gray-400">{item.competition}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => onGetIdeas(item)}
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
                    aria-label={`Get content ideas for ${item.keyword}`}
                    >
                     <span role="img" aria-hidden="true">✨</span>
                    <span>Get Ideas</span>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

// Simple fade-in animation using Tailwind config
const animationStyle = `
  @keyframes fade-in {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;

const ResultsTableWithAnimation: React.FC<ResultsTableProps> = (props) => (
  <>
    <style>{animationStyle}</style>
    <ResultsTable {...props} />
  </>
);

export default ResultsTableWithAnimation;
