import { useState } from 'react';
import { SparklesIcon, ChevronDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { geminiService } from '../utils/aiEmailEnhance';
import { useToast } from '../context/ToastContext';

function AIEmailEnhancer({ currentContent, onContentUpdate, onSubjectUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('enhance');
    const [enhancementOptions, setEnhancementOptions] = useState({
        purpose: 'improve',
        tone: 'professional',
        type: 'general',
        audience: 'general'
    });
    const [generatedSubjects, setGeneratedSubjects] = useState([]);
    const { showToast } = useToast();

    const handleEnhanceContent = async () => {
        if (!currentContent || currentContent.trim() === '') {
            showToast('error', 'Please enter some content to enhance');
            return;
        }

        console.log('Starting AI enhancement for content:', currentContent.substring(0, 100) + '...');
        setIsLoading(true);
        try {
            const result = await geminiService.enhanceEmailContent(currentContent, enhancementOptions);
            
            if (result.success) {
                console.log('AI Enhancement successful, result:', result.content.substring(0, 100) + '...');
                console.log('Calling onContentUpdate callback...');
                
                // Call the content update callback
                onContentUpdate(result.content);
                
                // If AI generated a subject update that too
                if (result.subject && onSubjectUpdate) {
                    console.log('AI also generated subject:', result.subject);
                    onSubjectUpdate(result.subject);
                    showToast('success', 'Content and subject enhanced successfully!');
                } else {
                    showToast('success', 'Content enhanced successfully!');
                }
                
                // Verify the callback was called
                console.log('onContentUpdate callback called successfully');
                
                // Closes the dropdown after a 150ms delay to prevent issues
                setTimeout(() => {
                    console.log('Closing AI enhancer dropdown');
                    setIsOpen(false);
                }, 150);
            } else {
                console.error('AI Enhancement failed:', result.error);
                showToast('error', result.error || 'Failed to enhance content');
            }
        } catch (error) {
            console.error('Enhancement error:', error);
            showToast('error', 'Failed to enhance content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateSubjects = async () => {
        if (!currentContent || currentContent.trim() === '') {
            showToast('error', 'Please enter email content first to generate subjects');
            return;
        }

        setIsLoading(true);
        try {
            const result = await geminiService.generateEmailSubject(currentContent, {
                tone: enhancementOptions.tone,
                type: enhancementOptions.type
            });
            
            if (result.success) {
                setGeneratedSubjects(result.subjects);
                showToast('success', 'Subject lines generated successfully!');
            } else {
                showToast('error', result.error || 'Failed to generate subjects');
            }
        } catch (error) {
            showToast('error', 'Failed to generate subjects. Please try again.');
            console.error('Subject generation error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImproveStructure = async () => {
        if (!currentContent || currentContent.trim() === '') {
            showToast('error', 'Please enter some content to restructure');
            return;
        }

        setIsLoading(true);
        try {
            const result = await geminiService.improveEmailStructure(currentContent);
            
            if (result.success) {
                console.log('AI Structure improvement successful, updating content:', result.content.substring(0, 100) + '...');
                
                // Updates content first
                onContentUpdate(result.content);
                
                // If AI generated a subject update that too
                if (result.subject && onSubjectUpdate) {
                    console.log('AI also generated subject during structure improvement:', result.subject);
                    onSubjectUpdate(result.subject);
                    showToast('success', 'Email structure and subject improved successfully!');
                } else {
                    showToast('success', 'Email structure improved successfully!');
                }
                
                // Closes the dropdown after a small delay to avoid conflicts
                setTimeout(() => {
                    setIsOpen(false);
                }, 100);
            } else {
                showToast('error', result.error || 'Failed to improve structure');
            }
        } catch (error) {
            showToast('error', 'Failed to improve structure. Please try again.');
            console.error('Structure improvement error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectSubject = (subject) => {
        onSubjectUpdate(subject);
        setGeneratedSubjects([]);
        showToast('success', 'Subject line applied!');
    };

    const purposeOptions = [
        { value: 'improve', label: 'Improve Overall' },
        { value: 'expand', label: 'Expand & Add Details' },
        { value: 'shorten', label: 'Make More Concise' },
        { value: 'change_tone', label: 'Change Tone' }
    ];

    const toneOptions = [
        { value: 'professional', label: 'Professional' },
        { value: 'friendly', label: 'Friendly' },
        { value: 'formal', label: 'Formal' },
        { value: 'casual', label: 'Casual' },
        { value: 'persuasive', label: 'Persuasive' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'warm', label: 'Warm' },
        { value: 'confident', label: 'Confident' }
    ];

    const typeOptions = [
        { value: 'general', label: 'General' },
        { value: 'sales', label: 'Sales' },
        { value: 'follow-up', label: 'Follow-up' },
        { value: 'introduction', label: 'Introduction' },
        { value: 'thank-you', label: 'Thank You' },
        { value: 'announcement', label: 'Announcement' },
        { value: 'invitation', label: 'Invitation' }
    ];

    const audienceOptions = [
        { value: 'general', label: 'General' },
        { value: 'clients', label: 'Clients' },
        { value: 'prospects', label: 'Prospects' },
        { value: 'colleagues', label: 'Colleagues' },
        { value: 'executives', label: 'Executives' },
        { value: 'customers', label: 'Customers' }
    ];

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-1 text-text-secondary-dark rounded-md bg-background-primary hover:bg-background-secondary border-border-dark hover:border-accent transition-all ease-in-out duration-300"
            >
                <SparklesIcon className="w-4 h-4" />
                <span className="text-xs font-medium">Enhance with AI</span>
                <ChevronDownIcon className={`w-3 h-3 stroke-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-border-dark rounded-lg shadow-xl w-96 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-border-light p-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('enhance')}
                            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors border-border-medium hover:border-accent ${
                                activeTab === 'enhance'
                                    ? 'bg-accent text-white border-transparent'
                                    : 'bg-background-primary text-text-secondary hover:bg-background-secondary'
                            }`}
                        >
                            Enhance Content
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('subjects')}
                            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors border-border-medium hover:border-accent ${
                                activeTab === 'subjects'
                                    ? 'bg-accent text-white border-transparent'
                                    : 'bg-background-primary text-text-secondary hover:bg-background-secondary'
                            }`}
                        >
                            Generate Subjects
                        </button>
                    </div>

                    <div className="p-4">
                        {activeTab === 'enhance' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary-dark mb-2">
                                        Enhancement Type
                                    </label>
                                    <select
                                        value={enhancementOptions.purpose}
                                        onChange={(e) => setEnhancementOptions(prev => ({ ...prev, purpose: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border-dark bg-background-primary rounded-md text-sm focus:outline-none focus:border-accent"
                                    >
                                        {purposeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary-dark mb-2">
                                            Tone
                                        </label>
                                        <select
                                            value={enhancementOptions.tone}
                                            onChange={(e) => setEnhancementOptions(prev => ({ ...prev, tone: e.target.value }))}
                                            className="w-full px-3 py-2 border border-border-dark bg-background-primary rounded-md text-sm focus:outline-none focus:border-accent"
                                        >
                                            {toneOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary-dark mb-2">
                                            Email Type
                                        </label>
                                        <select
                                            value={enhancementOptions.type}
                                            onChange={(e) => setEnhancementOptions(prev => ({ ...prev, type: e.target.value }))}
                                            className="w-full px-3 py-2 border border-border-dark bg-background-primary rounded-md text-sm focus:outline-none focus:border-accent"
                                        >
                                            {typeOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary-dark mb-2">
                                        Target Audience
                                    </label>
                                    <select
                                        value={enhancementOptions.audience}
                                        onChange={(e) => setEnhancementOptions(prev => ({ ...prev, audience: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border-dark bg-background-primary rounded-md text-sm focus:outline-none focus:border-accent"
                                    >
                                        {audienceOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleEnhanceContent}
                                        disabled={isLoading}
                                        className="flex-1 flex items-center text-xs justify-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-70 transition-colors"
                                    >
                                        {isLoading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                                        <SparklesIcon className="w-4 h-4" />
                                        Enhance Content
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleImproveStructure}
                                        disabled={isLoading}
                                        className="flex-1 flex items-center text-xs justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-70 transition-colors"
                                    >
                                        {isLoading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                                        Improve Structure
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'subjects' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary-dark mb-2">
                                            Tone
                                        </label>
                                        <select
                                            value={enhancementOptions.tone}
                                            onChange={(e) => setEnhancementOptions(prev => ({ ...prev, tone: e.target.value }))}
                                            className="w-full px-3 py-2 border border-border-dark bg-background-primary rounded-md text-sm focus:outline-none focus:border-accent"
                                        >
                                            {toneOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary-dark mb-2">
                                            Email Type
                                        </label>
                                        <select
                                            value={enhancementOptions.type}
                                            onChange={(e) => setEnhancementOptions(prev => ({ ...prev, type: e.target.value }))}
                                            className="w-full px-3 py-2 border border-border-dark bg-background-primary rounded-md text-sm focus:outline-none focus:border-accent"
                                        >
                                            {typeOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGenerateSubjects}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center text-sm gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-70 transition-colors"
                                >
                                    {isLoading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                                    <SparklesIcon className="w-4 h-4" />
                                    Generate Subject Lines
                                </button>

                                {generatedSubjects.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-text-secondary-dark mb-2">
                                            Generated Subject Lines:
                                        </h4>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {generatedSubjects.map((subject, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleSelectSubject(subject)}
                                                    className="w-full text-left p-3 bg-background-secondary hover:bg-background-primary border border-border-light rounded-md transition-colors"
                                                >
                                                    <span className="text-sm text-text-primary">{subject}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="px-4 py-3 bg-background-secondary border-t border-border-light">
                        <p className="text-xs text-text-secondary">
                            AI suggestions are generated by AI (Gemini) and should be reviewed before use. 
                            All placeholder variables will be preserved.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AIEmailEnhancer; 