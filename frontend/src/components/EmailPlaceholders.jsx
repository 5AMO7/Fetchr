import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const placeholderGroups = [
  {
    name: 'Sender',
    icon: '👤',
    placeholders: [
      { key: 'sender.first-name', label: 'First Name', description: "Sender's first name" },
      { key: 'sender.last-name', label: 'Last Name', description: "Sender's last name" },
      { key: 'sender.full-name', label: 'Full Name', description: "Full name (first + last)" },
      { key: 'sender.email', label: 'Email Address', description: "Sender's email address" },
      { key: 'sender.phone', label: 'Phone', description: "Phone number" },
      { key: 'sender.job-title', label: 'Job Title', description: "Job title (e.g. Sales Manager)" },
      { key: 'sender.company', label: 'Company', description: "Company name" },
      { key: 'sender.company-website', label: 'Company Website', description: "URL of the company" },
      { key: 'sender.company-industry', label: 'Industry', description: "Industry sector (e.g. SaaS)" },
      { key: 'sender.linkedin', label: 'LinkedIn Profile', description: "LinkedIn profile URL" },
      { key: 'sender.signature', label: 'Signature', description: "Custom email signature" },
      { key: 'sender.city', label: 'City', description: "City of the sender" },
      { key: 'sender.country', label: 'Country', description: "Country of the sender" }
    ]
  },
  {
    name: 'Receiver',
    icon: '👥',
    placeholders: [
      { key: 'receiver.email', label: 'Email Address', description: "Email address" },
      { key: 'receiver.company', label: 'Company', description: "Company name" },
      { key: 'receiver.company-website', label: 'Company Website', description: "Company website" },
      { key: 'receiver.city', label: 'City', description: "City" },
      { key: 'receiver.country', label: 'Country', description: "Country" }
    ]
  },
  {
    name: 'Date & Time',
    icon: '📅',
    placeholders: [
      { key: 'current.date', label: 'Current Date', description: "Current date (e.g. May 20, 2025)" },
      { key: 'current.day', label: 'Day of Week', description: "Day of the week" }
    ]
  },
  {
    name: 'Other',
    icon: '⚙️',
    placeholders: [
      { key: 'unsubscribe.link', label: 'Unsubscribe Link', description: "Link to unsubscribe" }
    ]
  }
];

function EmailPlaceholders({ onInsertPlaceholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (groupName) => {
    setExpandedGroups({
      ...expandedGroups,
      [groupName]: !expandedGroups[groupName]
    });
  };

  const handleInsert = (key) => {
    onInsertPlaceholder(`[{{${key}}}](placeholder)`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-xs px-3 pe-2 py-1 rounded-md bg-background-primary text-text-secondary-dark hover:bg-background-secondary hover:border-accent border border-border-dark"
      >
        <span>Placeholders</span>
        {isOpen ? (
          <ChevronUpIcon className="h-3 w-3 stroke-2" />
        ) : (
          <ChevronDownIcon className="h-3 w-3 stroke-2" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-border-dark rounded-md shadow-lg w-72 overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            <div className="px-3 py-2 border-b border-border-light bg-background-secondary">
              <p className="text-xs text-text-secondary">
                Insert placeholders in your email template. Click to add.
              </p>
            </div>
            
            {placeholderGroups.map((group) => (
              <div key={group.name} className="bg-background-primary border-b border-border-light last:border-b-0">
                <button
                  type="button"
                  className="bg-background-primary flex items-center w-full px-3 py-2 hover:bg-background-secondary hover:border-accent text-left"
                  onClick={() => toggleGroup(group.name)}
                >
                  <span className="mr-2">{group.icon}</span>
                  <span className="font-medium text-sm">{group.name}</span>
                  <span className="ml-auto">
                    {expandedGroups[group.name] ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </span>
                </button>

                {expandedGroups[group.name] && (
                  <div className="bg-background-secondary py-1">
                    {group.placeholders.map((placeholder) => (
                      <button
                        key={placeholder.key}
                        type="button"
                        onClick={() => handleInsert(placeholder.key)}
                        className="bg-background-primary w-full text-left px-3 py-2 text-sm hover:bg-background-primary hover:border-accent flex items-center"
                      >
                        <div>
                          <div className="font-medium">{placeholder.label}</div>
                          <div className="text-xs text-text-secondary">{placeholder.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailPlaceholders; 