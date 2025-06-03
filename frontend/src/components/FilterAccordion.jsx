import { useState, useRef, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence } from 'motion/react';
import * as Motion from 'motion/react';
import { useFilters } from '../context/FilterContext';

function FilterAccordion({ title, options = [], filterCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Use the filter context
  const { filters, updateFilter } = useFilters();
  const selectedOptions = filters[filterCategory] || [];

  // Filter options based on search term
  const filteredOptions = options.filter(
    option => option.toLowerCase().includes(searchTerm.toLowerCase()) && 
              !selectedOptions.includes(option)
  );

  // Position dropdown appropriately
  useEffect(() => {
    const positionDropdown = () => {
      if (isDropdownOpen && dropdownRef.current && inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        dropdownRef.current.style.position = 'fixed';
        dropdownRef.current.style.width = `${inputRect.width}px`;
        dropdownRef.current.style.top = `${inputRect.bottom + window.scrollY}px`;
        dropdownRef.current.style.left = `${inputRect.left + window.scrollX}px`;
      }
    };

    positionDropdown();
    window.addEventListener('resize', positionDropdown);
    
    return () => window.removeEventListener('resize', positionDropdown);
  }, [isDropdownOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSelect = (option) => {
    const newSelectedOptions = [...selectedOptions, option];
    updateFilter(filterCategory, newSelectedOptions);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleRemove = (option) => {
    const newSelectedOptions = selectedOptions.filter(item => item !== option);
    updateFilter(filterCategory, newSelectedOptions);
  };

  const handleClearAll = () => {
    updateFilter(filterCategory, []);
  };

  return (
    <div className="mb-2 pb-2 border-b-2 border-border-light overflow-hidden">
      <div 
        className="flex items-center justify-between p-1 bg-background-secondary cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-text-primary font-medium select-none">{title}</h3>
          {selectedOptions.length > 0 && (
            <span className="bg-accent text-white text-xs rounded-full px-1 font-medium min-w-[16px] text-center">
              {selectedOptions.length}
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
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedOptions.map((option) => (
                // tags
                <div 
                  key={option}
                  className="flex items-center gap-1 px-2 py-1 bg-background-secondary border-2 border-border-light rounded-lg text-xs small-button-shadow select-none"
                >
                  <span>{option}</span>
                  <XMarkIcon 
                    className="h-3 w-3 cursor-pointer stroke-2" 
                    onClick={() => handleRemove(option)}
                  />
                </div>
              ))}
              
              {selectedOptions.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="bg-background-primary border border-border-light p-[6px] rounded-lg cursor-pointer hover:bg-dark-primary hover:border-border-light transition-all duration-300 ease-in-out small-button-shadow text-xs"
                >
                  Clear all
                </button>
              )}
            </div>
            
            {/* search field */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
                placeholder={`Search for ${title.toLowerCase()}...`}
                className="w-full p-2 border border-border-light rounded-lg focus:outline-none focus:ring-1 focus:ring-accent"
              />
              
              {/* dropdown */}
              {isDropdownOpen && filteredOptions.length > 0 && (
                <div 
                  ref={dropdownRef}
                  className="fixed z-50 bg-background-primary border border-border-light rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  {filteredOptions.map((option) => (
                    <div
                      key={option}
                      className="p-2 hover:bg-background-secondary cursor-pointer"
                      onMouseDown={() => handleSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Motion.motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterAccordion; 