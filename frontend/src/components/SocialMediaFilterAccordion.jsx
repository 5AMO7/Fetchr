import { useState } from 'react';
import { ChevronDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook, faLinkedin, faInstagramSquare, faSquareXTwitter } from "@fortawesome/free-brands-svg-icons";
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { AnimatePresence } from 'motion/react';
import * as Motion from 'motion/react';
import { useFilters } from '../context/FilterContext';

function SocialMediaFilterAccordion({ title = "Social Media" }) {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, updateFilter } = useFilters();
  const socialMediaFilters = filters.socialMedia || {};

  const socialPlatforms = [
    {
      key: 'website',
      name: 'Website',
      icon: <GlobeAltIcon className="w-5 h-5 stroke-2" />,
      color: '#157145'
    },
    {
      key: 'facebook',
      name: 'Facebook',
      icon: <FontAwesomeIcon icon={faSquareFacebook} size="lg" />,
      color: '#1877F2'
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      icon: <FontAwesomeIcon icon={faLinkedin} size="lg" />,
      color: '#0A66C2'
    },
    {
      key: 'instagram',
      name: 'Instagram',
      icon: <FontAwesomeIcon icon={faInstagramSquare} size="lg" />,
      color: '#E4405F'
    },
    {
      key: 'twitter',
      name: 'Twitter/X',
      icon: <FontAwesomeIcon icon={faSquareXTwitter} size="lg" />,
      color: '#000000'
    }
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSocialMediaToggle = (platform, state) => {
    const currentFilters = { ...socialMediaFilters };
    
    if (state === 'clear') {
      // Remove the filter for this platform
      delete currentFilters[platform];
    } else {
      // Set the filter state (true for "has", false for "doesn't have")
      currentFilters[platform] = state === 'has';
    }
    
    updateFilter('socialMedia', currentFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(socialMediaFilters).length;
  };

  const getPlatformState = (platformKey) => {
    if (!(platformKey in socialMediaFilters)) return 'clear';
    return socialMediaFilters[platformKey] ? 'has' : 'doesnt-have';
  };

  const cycleToggleState = (platformKey) => {
    const currentState = getPlatformState(platformKey);
    let nextState;
    
    switch (currentState) {
      case 'clear':
        nextState = 'has';
        break;
      case 'has':
        nextState = 'doesnt-have';
        break;
      case 'doesnt-have':
        nextState = 'clear';
        break;
      default:
        nextState = 'clear';
    }
    
    handleSocialMediaToggle(platformKey, nextState);
  };

  const ThreeWayToggle = ({ platform }) => {
    const state = getPlatformState(platform.key);
    
    const getToggleStyles = () => {
      switch (state) {
        case 'has':
          return {
            bg: 'bg-success',
            border: 'border-border-success',
            text: 'text-text-success',
            icon: <CheckIcon className="w-3 h-3 stroke-2" />,
            tooltip: 'Has ' + platform.name
          };
        case 'doesnt-have':
          return {
            bg: 'bg-danger',
            border: 'border-border-danger',
            text: 'text-text-danger',
            icon: <XMarkIcon className="w-3 h-3 stroke-2" />,
            tooltip: "Doesn't have " + platform.name
          };
        default:
          return {
            bg: 'bg-background-primary',
            border: 'border-border-light',
            text: 'text-text-secondary',
            icon: <div className="w-3 h-3 rounded-full border border-current opacity-50" />,
            tooltip: 'No filter for ' + platform.name
          };
      }
    };

    const styles = getToggleStyles();

    return (
      <Motion.motion.button
        onClick={() => cycleToggleState(platform.key)}
        className={`relative flex items-center justify-center w-8 h-6 rounded-full border transition-all duration-200 hover:opacity-75 hover:border-current ${styles.bg} ${styles.border} ${styles.text}`}
        title={styles.tooltip}
        whileTap={{ scale: 0.95 }}
        style={{ borderColor: 'inherit' }}
      >
        <Motion.motion.div
          key={state}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {styles.icon}
        </Motion.motion.div>
        
        {/* State indicator dots */}
        <div className="absolute -bottom-2 flex gap-0.5">
          <div className={`w-1 h-1 rounded-full transition-all duration-200 ${
            state === 'doesnt-have' ? 'bg-text-danger' : 'bg-gray-300'
          }`} />
          <div className={`w-1 h-1 rounded-full transition-all duration-200 ${
            state === 'clear' ? 'bg-gray-400' : 'bg-gray-300'
          }`} />
          <div className={`w-1 h-1 rounded-full transition-all duration-200 ${
            state === 'has' ? 'bg-text-success' : 'bg-gray-300'
          }`} />
        </div>
      </Motion.motion.button>
    );
  };

  return (
    <div className="mb-2 pb-2 border-b-2 border-border-light overflow-hidden">
      <div 
        className="flex items-center justify-between p-1 bg-background-secondary cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-text-primary font-medium select-none">{title}</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-accent text-white text-xs rounded-full px-1 font-medium min-w-[16px] text-center">
              {getActiveFiltersCount()}
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
            className="p-2 bg-background-secondary overflow-hidden"
          >
            {/* Social media platform toggles */}
            <div className="space-y-3">
              {socialPlatforms.map((platform) => (
                <div key={platform.key} className="flex items-center justify-between py-1">
                  {/* Platform name and icon */}
                  <div className="flex items-center gap-2 text-text-primary text-sm min-w-0 flex-1">
                    <div style={{ color: platform.color }} className="flex-shrink-0">
                      {platform.icon}
                    </div>
                    <span className="truncate">{platform.name}</span>
                  </div>
                  
                  {/* Three-way toggle */}
                  <ThreeWayToggle platform={platform} />
                </div>
              ))}
            </div>
          </Motion.motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SocialMediaFilterAccordion; 