import { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import MDEditor, { commands } from '@uiw/react-md-editor';
import EmailPlaceholders from '../components/EmailPlaceholders';
import AIEmailEnhancer from '../components/AIEmailEnhancer';
import { useToast } from '../context/ToastContext';

// Custom commands so that there is no insert image button
const customCommands = [
    commands.bold, 
    commands.italic, 
    commands.strikethrough, 
    commands.hr, 
    commands.title, 
    commands.divider, 
    commands.link, 
    commands.quote, 
    commands.code, 
    commands.divider, 
    commands.unorderedList, 
    commands.orderedList, 
    commands.checkedList, 
    commands.divider, 
    commands.help
];

function EmailTemplatesEdit() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [editorView] = useState('edit');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
    const [forceRender, setForceRender] = useState(0); // Force re-render trigger
    const navigate = useNavigate();
    const textareaRef = useRef(null);
    const { showToast } = useToast();
    const currentContentRef = useRef('');

    // Initialize content ref
    useEffect(() => {
        currentContentRef.current = body;
    }, [body]);

    // Fetch the template data when the component loads
    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await api.get(`/email-templates/${id}`);
                const template = response.data;
                
                setName(template.name);
                setSubject(template.subject);
                setBody(template.body);
                setIsLoadingTemplate(false);
            } catch (err) {
                showToast('error', err.response?.data?.message || 'Failed to load template');
                setIsLoadingTemplate(false);
            }
        };

        fetchTemplate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Only depend on id, not showToast to prevent re-running and overwriting AI content

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await api.put(`/email-templates/${id}`, {
                name,
                subject,
                body
            });
            
            showToast('success', 'Email template updated successfully');
            setTimeout(() => {
                navigate('/email-templates');
            }, 1500);
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to update email template');
            setIsLoading(false);
        }
    };

    const handleInsertPlaceholder = (placeholderText) => {
        setTimeout(() => {
            const textarea = document.querySelector('.w-md-editor-text-input');
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newText = body.substring(0, start) + placeholderText + body.substring(end);
                setBody(newText);
                
                // Focus and set cursor position right after the inserted text
                setTimeout(() => {
                    textarea.focus();
                    const newPosition = start + placeholderText.length;
                    textarea.setSelectionRange(newPosition, newPosition);
                }, 100);
            } else {
                const newBody = body + (body && !body.endsWith('\n') ? '\n' : '') + placeholderText;
                setBody(newBody);
            }
        }, 0);
    };

    const handleAIContentUpdate = (newContent) => {
        console.log('AI Content Update received:', newContent.substring(0, 100) + '...');
        console.log('Current body before update:', body.substring(0, 100) + '...');
        
        // Step 1: Clear the content first
        flushSync(() => {
            console.log('Step 1: Clearing content');
            setBody('');
            setForceRender(prev => prev + 1);
        });
        
        // Step 2: Set the new content after a brief delay
        setTimeout(() => {
            flushSync(() => {
                console.log('Step 2: Setting new content');
                setBody(newContent);
                currentContentRef.current = newContent;
                setForceRender(prev => prev + 1);
            });
            
            console.log('AI content update complete');
        }, 50);
        
        // Verify the update worked
        setTimeout(() => {
            console.log('Final verification - body state:', body.substring(0, 100) + '...');
            console.log('Final verification - ref content:', currentContentRef.current.substring(0, 100) + '...');
            
            const textarea = document.querySelector('.w-md-editor-text-input');
            if (textarea) {
                console.log('Final verification - DOM textarea:', textarea.value.substring(0, 100) + '...');
            }
        }, 200);
    };

    const handleBodyChange = (value) => {
        const newValue = value || '';
        console.log('Body change detected:', newValue.substring(0, 50) + '...');
        currentContentRef.current = newValue;
        setBody(newValue);
    };

    const handleAISubjectUpdate = (newSubject) => {
        console.log('AI Subject Update received:', newSubject);
        setSubject(newSubject);
    };

    useEffect(() => {
        console.log('Body state changed via useEffect:', body.substring(0, 100) + '...');
    }, [body]);

    if (isLoadingTemplate) {
        return (
            <div className='flex h-screen w-screen'>
                <Sidebar />
                <main className='flex flex-col bg-background-primary w-full h-full p-4 px-20 overflow-hidden large-section-shadow z-10 items-center justify-center'>
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
                    <p className="mt-2 text-text-secondary">Loading template...</p>
                </main>
            </div>
        );
    }

    return (
        <div className='flex h-screen w-screen'>
            <Sidebar />

            <main className='flex flex-col bg-background-primary w-full h-full p-4 px-20 overflow-hidden large-section-shadow z-10 items-center'>
                <div className='flex justify-between items-center mb-6 w-3xl'>
                    <h1 className='text-2xl font-semibold text-text-primary'>Edit Email Template</h1>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 w-full max-w-3xl">
                    <div className='flex flex-col gap-4 mb-6'>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-secondary-dark mb-1">
                                Template Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="block w-full rounded-md py-2 px-3 text-md text-text-primary border border-border-dark focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Enter template name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-text-secondary-dark mb-1">
                                Email Subject
                            </label>
                            <input
                                id="subject"
                                name="subject"
                                type="text"
                                required
                                className="block w-full rounded-md py-2 px-3 text-md text-text-primary border border-border-dark focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Enter email subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="body" className="block text-sm font-medium text-text-secondary-dark">
                                    Email Body
                                </label>
                                <div className="flex gap-2">
                                    <EmailPlaceholders onInsertPlaceholder={handleInsertPlaceholder} />
                                    <AIEmailEnhancer 
                                        currentContent={body}
                                        onContentUpdate={handleAIContentUpdate}
                                        onSubjectUpdate={handleAISubjectUpdate}
                                    />
                                </div>
                            </div>
                            <div data-color-mode="light" key={`editor-${forceRender}`}>
                                <MDEditor
                                    id="body"
                                    value={body}
                                    onChange={handleBodyChange}
                                    height={350}
                                    preview={editorView}
                                    className="border border-border-dark rounded-lg"
                                    textareaProps={{ ref: textareaRef }}
                                    commands={customCommands}
                                />
                            </div>
                            <p className="text-xs text-text-secondary-dark mt-1">
                                Format your email using the toolbar buttons above or by writing Markdown directly. 
                                Use the Placeholders dropdown to insert template variables.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-70"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/email-templates')}
                            className="bg-gray-200 text-text-secondary-dark px-4 py-2 rounded-md hover:bg-gray-300 hover:border-accent focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default EmailTemplatesEdit; 