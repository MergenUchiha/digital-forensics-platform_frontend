import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockCases, mockEvidence } from '@/data/mockData';

interface SearchResult {
  id: string;
  type: 'case' | 'evidence' | 'event';
  title: string;
  subtitle?: string;
  icon: typeof FileText;
  path: string;
}

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar = ({ placeholder = 'Search...', autoFocus = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Загрузка недавних поисков
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Поиск
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const foundResults: SearchResult[] = [];

    // Поиск в cases
    mockCases.forEach(c => {
      if (c.title.toLowerCase().includes(searchQuery) || 
          c.description.toLowerCase().includes(searchQuery) ||
          c.tags.some(tag => tag.toLowerCase().includes(searchQuery))) {
        foundResults.push({
          id: c.id,
          type: 'case',
          title: c.title,
          subtitle: c.description,
          icon: FileText,
          path: `/cases/${c.id}`,
        });
      }
    });

    // Поиск в evidence
    mockEvidence.forEach(e => {
      if (e.name.toLowerCase().includes(searchQuery) || 
          e.description?.toLowerCase().includes(searchQuery)) {
        foundResults.push({
          id: e.id,
          type: 'evidence',
          title: e.name,
          subtitle: e.description,
          icon: FileText,
          path: `/evidence`,
        });
      }
    });

    setResults(foundResults.slice(0, 10));
    setSelectedIndex(0);
  }, [query]);

  // Клик вне области
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    // Сохраняем в историю
    const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    navigate(result.path);
    setQuery('');
    setIsOpen(false);
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    setIsOpen(true);
  };

  const typeColors = {
    case: 'text-blue-400 bg-blue-500/10',
    evidence: 'text-green-400 bg-green-500/10',
    event: 'text-yellow-400 bg-yellow-500/10',
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 transition-all"
        />
      </div>

      {/* Results Dropdown */}
      {isOpen && (query.length >= 2 || recentSearches.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          {/* Search Results */}
          {query.length >= 2 && results.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-gray-500 font-medium uppercase border-b border-gray-800">
                Search Results
              </div>
              {results.map((result, index) => {
                const Icon = result.icon;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-800 transition-colors text-left ${
                      isSelected ? 'bg-gray-800' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-100 truncate">
                          {result.title}
                        </p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${typeColors[result.type]}`}>
                          {result.type}
                        </span>
                      </div>
                      {result.subtitle && (
                        <p className="text-xs text-gray-400 line-clamp-1">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No results found for "{query}"</p>
            </div>
          )}

          {/* Recent Searches */}
          {query.length < 2 && recentSearches.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-gray-500 font-medium uppercase border-b border-gray-800 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearch(search)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors text-left"
                >
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-300">{search}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};