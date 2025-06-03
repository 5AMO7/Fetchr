import { useState, useEffect } from "react";
import EmailTemplateTableRow from "./EmailTemplateTableRow";
import EmailTemplateTableSkeleton from "./EmailTemplateTableSkeleton";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

function EmailTemplateTable() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await api.get('/email-templates');
                
                const data = response.data;
                setTemplates(data);
                setLoading(false);
            } catch (err) {
                console.error("API Error:", err); // Debug log
                showToast('error', err.response?.data?.message || 'Failed to load templates');
                setLoading(false);
            }
        };

        fetchTemplates();
    }, [showToast]);

    return (
        <div className="flex flex-col w-full h-full bg-background-primary rounded-xl border border-border-dark overflow-hidden shadow-md mt-6">
            <div className="w-full border-b border-border-dark grid grid-cols-[3rem_2fr_2fr_3fr_1fr] items-center justify-start px-6 py-3">
                <input type="checkbox" className="w-[1.125rem] h-[1.125rem] rounded-xl border border-border-dark accent-accent me-5" />
                <span className="text-text-secondary-dark text-md">Name</span>
                <span className="text-text-secondary-dark text-md">Subject</span>
                <span className="text-text-secondary-dark text-md">Body</span>
                <span className="sr-only">View/Edit</span>
            </div>
            <div className="w-full h-full flex flex-col overflow-y-scroll overflow-x-hidden">
                {loading ? (
                    <>
                        <EmailTemplateTableSkeleton />
                        <div className="opacity-90">
                            <EmailTemplateTableSkeleton />
                        </div>
                        <div className="opacity-80">
                            <EmailTemplateTableSkeleton />
                        </div>
                        <div className="opacity-70">
                            <EmailTemplateTableSkeleton />
                        </div>
                        <div className="opacity-60">
                            <EmailTemplateTableSkeleton />
                        </div>
                        <div className="opacity-50">
                            <EmailTemplateTableSkeleton />
                        </div>
                        <div className="opacity-40">
                            <EmailTemplateTableSkeleton />
                        </div>
                        <div className="opacity-30">
                            <EmailTemplateTableSkeleton />
                        </div>
                    </>
                ) : templates.length === 0 ? (
                    <div className="flex items-center justify-center p-4">You have no email templates, <a href="#" className="text-accent ms-2 hover:text-accent">create some!</a> </div>
                ) : (
                    templates.map((template) => (
                        <EmailTemplateTableRow 
                            key={template.id}
                            id={template.id}
                            name={template.name} 
                            subject={template.subject} 
                            body={template.body}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default EmailTemplateTable;