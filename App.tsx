
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { KeywordData, ContentIdeas } from './types';
import { fetchKeywordIdeas, fetchContentIdeas } from './services/geminiService';
import KeywordInput from './components/KeywordInput';
import ResultsTable from './components/ResultsTable';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Welcome from './components/Welcome';
import Pagination from './components/Pagination';
import AdvancedControls from './components/FilterControls';
import ContentIdeasModal from './components/ContentIdeasModal';

const ITEMS_PER_PAGE = 20;

type SortConfig = {
  key: keyof KeywordData;
  direction: 'ascending' | 'descending';
};

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [results, setResults] = useState<KeywordData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Advanced Filters State
  const [country, setCountry] = useState<string>('United States');
  const [filterType, setFilterType] = useState<'all' | 'containing'>('all');
  const [minVolume, setMinVolume] = useState<string>('');
  const [maxDifficulty, setMaxDifficulty] = useState<string>('100');
  const [minLength, setMinLength] = useState<string>('');
  const [maxLength, setMaxLength] = useState<string>('');
  const [includeWords, setIncludeWords] = useState<string>('');
  const [excludeWords, setExcludeWords] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'searchVolume', direction: 'descending' });

  // Content Ideas Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalKeyword, setModalKeyword] = useState<KeywordData | null>(null);
  const [modalContent, setModalContent] = useState<ContentIdeas | null>(null);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const prevCountryRef = useRef<string>(country);


  const handleSearch = useCallback(async (searchTopic: string) => {
    if (!searchTopic.trim()) {
      setError('Please enter a topic.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setCurrentPage(1);
    setTopic(searchTopic);

    try {
      const data = await fetchKeywordIdeas(searchTopic, country);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [country]);

  // Effect to refetch data when the country changes
  useEffect(() => {
    const hasCountryChanged = prevCountryRef.current !== country;
    
    // If the country changed AND we have a topic, refetch the data.
    if (hasCountryChanged && topic) {
      const refetchForCountry = async () => {
        setIsLoading(true);
        setError(null);
        setResults([]);
        setCurrentPage(1);

        try {
          const data = await fetchKeywordIdeas(topic, country);
          setResults(data);
        } catch (err: any) {
          setError(err.message || `Failed to fetch keywords for ${country}.`);
        } finally {
          setIsLoading(false);
        }
      };
      
      refetchForCountry();
    }
    
    // Update the ref for the next render AFTER all logic.
    prevCountryRef.current = country;
  }, [country, topic]);

  const handleSort = useCallback((key: keyof KeywordData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const handleGetIdeas = useCallback(async (keywordData: KeywordData) => {
    setModalKeyword(keywordData);
    setIsModalOpen(true);
    setIsModalLoading(true);
    setModalError(null);
    setModalContent(null);

    try {
      const ideas = await fetchContentIdeas(keywordData.keyword, topic);
      setModalContent(ideas);
    } catch (err: any) {
      setModalError(err.message || 'Failed to generate content ideas.');
    } finally {
      setIsModalLoading(false);
    }
  }, [topic]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalKeyword(null);
    setModalContent(null);
    setModalError(null);
  };
  
  const processedResults = useMemo(() => {
    let filtered = [...results];

    // Filter type
    if (filterType === 'containing' && topic) {
      filtered = filtered.filter(item => item.keyword.toLowerCase().includes(topic.toLowerCase()));
    }

    // Min Volume
    const minVol = parseInt(minVolume, 10);
    if (!isNaN(minVol) && minVol > 0) {
      filtered = filtered.filter(item => item.searchVolume >= minVol);
    }

    // Max Difficulty
    const maxDiff = parseInt(maxDifficulty, 10);
    if (!isNaN(maxDiff) && maxDiff < 100) {
      filtered = filtered.filter(item => item.competition <= maxDiff);
    }

    // Word Length
    const minLen = parseInt(minLength, 10);
    const maxLen = parseInt(maxLength, 10);
    const getWordCount = (str: string) => str.split(' ').filter(Boolean).length;
    if (!isNaN(minLen) && minLen > 0) {
      filtered = filtered.filter(item => getWordCount(item.keyword) >= minLen);
    }
    if (!isNaN(maxLen) && maxLen > 0) {
      filtered = filtered.filter(item => getWordCount(item.keyword) <= maxLen);
    }
    
    // Include/Exclude Words
    const include = includeWords.toLowerCase().split(',').map(w => w.trim()).filter(Boolean);
    const exclude = excludeWords.toLowerCase().split(',').map(w => w.trim()).filter(Boolean);
    if (include.length > 0) {
        filtered = filtered.filter(item => include.every(word => item.keyword.toLowerCase().includes(word)));
    }
    if (exclude.length > 0) {
        filtered = filtered.filter(item => !exclude.some(word => item.keyword.toLowerCase().includes(word)));
    }

    // Sorting
    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [results, filterType, topic, minVolume, maxDifficulty, minLength, maxLength, includeWords, excludeWords, sortConfig]);
  
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedResults, currentPage]);

  const totalPages = Math.ceil(processedResults.length / ITEMS_PER_PAGE);

  const handleExport = useCallback(() => {
    const headers = ["Keyword", "Search Volume", "Competition"];
    const rows = processedResults.map(item => [
      `"${item.keyword.replace(/"/g, '""')}"`,
      item.searchVolume,
      item.competition
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${topic.replace(/\s+/g, '_')}_keywords.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedResults, topic]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            YouTube Keyword Maestro
          </h1>
          <p className="text-lg text-gray-400 mt-2">Unlock Your Channel's Potential with AI-Powered Insights</p>
        </header>

        <main>
          <KeywordInput onSearch={handleSearch} isLoading={isLoading} />

          <div className="mt-12">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && results.length > 0 && (
              <>
                <AdvancedControls
                  topic={topic}
                  country={country}
                  setCountry={setCountry}
                  filterType={filterType}
                  setFilterType={setFilterType}
                  minVolume={minVolume}
                  setMinVolume={setMinVolume}
                  maxDifficulty={maxDifficulty}
                  setMaxDifficulty={setMaxDifficulty}
                  minLength={minLength}
                  setMinLength={setMinLength}
                  maxLength={maxLength}
                  setMaxLength={setMaxLength}
                  includeWords={includeWords}
                  setIncludeWords={setIncludeWords}
                  excludeWords={excludeWords}
                  setExcludeWords={setExcludeWords}
                  onExport={handleExport}
                />
                
                {processedResults.length > 0 ? (
                  <>
                    <ResultsTable 
                      data={paginatedResults} 
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      onGetIdeas={handleGetIdeas}
                    />
                    {totalPages > 1 && (
                      <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-400 p-8 bg-gray-800/50 rounded-lg border border-gray-700">
                    No results match your current filters.
                  </div>
                )}
              </>
            )}
            {!isLoading && !error && results.length === 0 && <Welcome />}
          </div>
        </main>
        
        <footer className="text-center text-gray-500 mt-16">
            <p>Powered by Google Gemini</p>
        </footer>
      </div>
      
      <ContentIdeasModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        keyword={modalKeyword}
        content={modalContent}
        isLoading={isModalLoading}
        error={modalError}
      />
    </div>
  );
};

export default App;
