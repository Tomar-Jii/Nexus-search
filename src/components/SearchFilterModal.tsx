import React from 'react';
import { X, Filter, Check } from 'lucide-react';
import { SearchFilter, TimeRange, SafeSearch, SearchRegion, SortOrder } from '../types';

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: SearchFilter;
  onApply: (filters: SearchFilter) => void;
}

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  isOpen,
  onClose,
  currentFilter,
  onApply
}) => {
  const [filterState, setFilterState] = React.useState<SearchFilter>(currentFilter);

  React.useEffect(() => {
    setFilterState(currentFilter);
  }, [currentFilter, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#1A1D27] border border-white/10 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Search Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Sections */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Time Range */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
              Time Range
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: TimeRange.ANY, label: 'Any time' },
                { id: TimeRange.PAST_24H, label: 'Past 24 hours' },
                { id: TimeRange.PAST_WEEK, label: 'Past week' },
                { id: TimeRange.PAST_MONTH, label: 'Past month' },
                { id: TimeRange.PAST_YEAR, label: 'Past year' }
              ].map(item => {
                const isSelected = filterState.timeRange === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilterState({ ...filterState, timeRange: item.id })}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SafeSearch */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
              SafeSearch
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: SafeSearch.OFF, label: 'Off' },
                { id: SafeSearch.MODERATE, label: 'Moderate' },
                { id: SafeSearch.STRICT, label: 'Strict' }
              ].map(item => {
                const isSelected = filterState.safeSearch === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilterState({ ...filterState, safeSearch: item.id })}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
              Region
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: SearchRegion.GLOBAL, label: 'Global' },
                { id: SearchRegion.US, label: 'United States' },
                { id: SearchRegion.UK, label: 'United Kingdom' },
                { id: SearchRegion.DE, label: 'Germany' },
                { id: SearchRegion.IN, label: 'India' },
                { id: SearchRegion.JP, label: 'Japan' }
              ].map(item => {
                const isSelected = filterState.region === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilterState({ ...filterState, region: item.id })}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
              Sort Order
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: SortOrder.RELEVANCE, label: 'Most Relevant' },
                { id: SortOrder.DATE, label: 'Most Recent' }
              ].map(item => {
                const isSelected = filterState.sortOrder === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilterState({ ...filterState, sortOrder: item.id })}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(filterState);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
