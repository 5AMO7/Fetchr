import { useState, useRef } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence } from 'motion/react';
import * as Motion from 'motion/react';
import { useFilters } from '../context/FilterContext';

function SearchAccordion({ title }) {
  const [isOpen, setIsOpen] = useState(true); // Open by default
  const inputRef = useRef(null);

  // Use the filter context
  const { filters, updateFilter } = useFilters();
  const searchValue = filters.companyName || '';

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    updateFilter('companyName', e.target.value);
  };

  const handleClear = () => {
    updateFilter('companyName', '');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="mb-2 pb-2 border-b-2 border-border-light overflow-hidden">
      <div 
        className="flex items-center justify-between p-1 bg-background-secondary cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-text-primary font-medium select-none">{title}</h3>
          {searchValue.trim() && (
            <span className="bg-accent text-white text-xs rounded-full px-1 font-medium min-w-[16px] text-center">
              1
            </span>
          )}
        </div>
        <Motion.motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.1 }}
        >
          <ChevronDownIcon className="h-5 w-5 text-text-primary" />
        </Motion.motion.div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <Motion.motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="p-3 pt-0 pb-1 bg-background-secondary overflow-hidden"
          >
            <div className="relative mt-2">
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={handleSearch}
                placeholder="Search company name..."
                className="w-full p-2 border border-border-light rounded-lg focus:outline-none focus:ring-1 focus:ring-accent pe-10"
              />
              {searchValue && (
                <button 
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 border-border-dark bg-background-primary p-1 rounded-full hover:bg-dark-primary hover:border-border-dark transition-all duration-300 ease-in-out"
                >
                  <XMarkIcon className="h-3 w-3 text-text-secondary-dark stroke-2" />
                </button>
              )}
            </div>
          </Motion.motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchAccordion; 