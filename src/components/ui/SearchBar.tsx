import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { casesService } from '@/services/cases.service';
import { evidenceService } from '@/services/evidence.service';
import { cn } from '@/utils/cn';

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
  // Read during the first render instead of from an effect, which painted an
  // empty list and then replaced it.
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // This searched `mockCases` and `mockEvidence` — the box in the header
  // never touched the API, so it found fictional cases and missed real ones.
  // The backend has no search endpoint, so the caller's own cases and evidence
  // are fetched once and filtered here.
  useEffect(() => {
    if (query.length < 2) {
      // Clearing on a short query is a synchronous set, so it goes through a
      // microtask rather than running straight in the effect body.
      const clear = setTimeout(() => setResults([]), 0);
      return () => clearTimeout(clear);
    }

    let cancelled = false;

    const run = async () => {
      try {
        const [cases, evidence] = await Promise.all([
          casesService.getAll(),
          evidenceService.getAll(),
        ]);
        if (cancelled) return;

        const needle = query.toLowerCase();
        const found: SearchResult[] = [];

        for (const c of cases) {
          const haystack = [c.title, c.description, ...(c.tags ?? [])]
            .join(' ')
            .toLowerCase();
          if (haystack.includes(needle)) {
            found.push({
              id: `case-${c.id}`,
              type: 'case',
              title: c.title,
              subtitle: c.description,
              icon: FileText,
              path: `/cases/${c.id}`,
            });
          }
        }

        for (const e of evidence) {
          const haystack = `${e.name} ${e.description ?? ''}`.toLowerCase();
          if (haystack.includes(needle)) {
            found.push({
              id: `evidence-${e.id}`,
              type: 'evidence',
              title: e.name,
              subtitle: e.description,
              icon: FileText,
              path: `/cases/${e.caseId}`,
            });
          }
        }

        setResults(found.slice(0, 10));
        setSelectedIndex(0);
      } catch {
        if (!cancelled) setResults([]);
      }
    };

    const debounce = setTimeout(() => void run(), 250);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    case: 'text-blue-500 bg-blue-500/10',
    evidence: 'text-green-500 bg-green-500/10',
    event: 'text-yellow-500 bg-yellow-500/10',
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
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
          className={cn(
            "w-full pl-10 pr-4 py-2.5 rounded-lg transition-all",
            "bg-bg-secondary border border-border-primary",
            "text-text-primary placeholder-text-muted",
            "focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
          )}
        />
      </div>

      {/* Results Dropdown */}
      {isOpen && (query.length >= 2 || recentSearches.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-bg-secondary border border-border-primary rounded-lg shadow-light-xl dark:shadow-dark-xl z-50 max-h-96 overflow-y-auto">
          {/* Search Results */}
          {query.length >= 2 && results.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-text-muted font-medium uppercase border-b border-border-primary">
                Search Results
              </div>
              {results.map((result, index) => {
                const Icon = result.icon;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className={cn(
                      "w-full px-4 py-3 flex items-start gap-3 transition-colors text-left",
                      "hover:bg-bg-hover",
                      isSelected && "bg-bg-hover"
                    )}
                  >
                    <Icon className="w-5 h-5 text-text-muted flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {result.title}
                        </p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${typeColors[result.type]}`}>
                          {result.type}
                        </span>
                      </div>
                      {result.subtitle && (
                        <p className="text-xs text-text-secondary line-clamp-1">
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
              <Search className="w-12 h-12 text-text-muted mx-auto mb-2" />
              <p className="text-text-secondary text-sm">No results found for "{query}"</p>
            </div>
          )}

          {/* Recent Searches */}
          {query.length < 2 && recentSearches.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-text-muted font-medium uppercase border-b border-border-primary flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={`recent-${index}`}
                  onClick={() => handleRecentSearch(search)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-bg-hover transition-colors text-left"
                >
                  <TrendingUp className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-primary">{search}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};