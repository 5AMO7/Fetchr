import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import MDEditor, { commands } from '@uiw/react-md-editor';
import EmailPlaceholders from '../components/EmailPlaceholders';
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

function EmailTemplatesCreate() {
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [editorView] = useState('edit');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const textareaRef = useRef(null);
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await api.post('/email-templates', {
                name,
                subject,
                body
            });
            
            showToast('success', 'Email template created successfully');
            setTimeout(() => {
                navigate('/email-templates');
            }, 1500);
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to create email template');
        } finally {
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

    return (
        <div className='flex h-screen w-screen'>
            <Sidebar />

            <main className='flex flex-col bg-background-primary w-full h-full p-4 px-20 overflow-hidden large-section-shadow z-10 items-center'>
                <div className='flex justify-between items-center mb-6 w-3xl'>
                    <h1 className='text-2xl font-semibold text-text-primary'>Create Email Template</h1>
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
                                </div>
                            </div>
                            <div data-color-mode="light">
                                <MDEditor
                                    id="body"
                                    value={body}
                                    onChange={setBody}
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
                            {isLoading ? 'Creating...' : 'Create Template'}
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

export default EmailTemplatesCreate;