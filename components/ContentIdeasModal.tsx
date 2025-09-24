
import React from 'react';
import { KeywordData, ContentIdeas } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface ContentIdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyword: KeywordData | null;
  content: ContentIdeas | null;
  isLoading: boolean;
  error: string | null;
}

const ContentIdeasModal: React.FC<ContentIdeasModalProps> = ({
  isOpen,
  onClose,
  keyword,
  content,
  isLoading,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in-fast"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <header className="p-4 sm:p-6 border-b border-gray-700 flex justify-between items-start sticky top-0 bg-gray-800 z-10">
          <div>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-white">Content Ideas for:</h2>
            <p className="text-purple-400 font-medium">{keyword?.keyword}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </header>
        
        <div className="p-4 sm:p-6">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {content && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-pink-400 mb-3">Suggested Video Titles</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  {content.titles.map((title, index) => (
                    <li key={index}>{title}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-3">Sample Description</h3>
                <p className="text-gray-400 whitespace-pre-wrap bg-gray-900/50 p-4 rounded-md border border-gray-700">
                  {content.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-fast {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in-fast {
          animation: fade-in-fast 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ContentIdeasModal;
