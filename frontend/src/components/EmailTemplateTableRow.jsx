import { PencilSquareIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import TooltipWrapper from "./TooltipWrapper";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { Link } from "react-router-dom";

function EmailTemplateTableRow({id, name, subject, body}) {
    return (
        <div className="w-full bg-background-primary border-b border-border-dark ps-6 pe-3 py-2 flex items-center justify-start">
            <div className="h-full w-full grid grid-cols-[3rem_2fr_2fr_3fr_1fr] items-center">
                <input type="checkbox" className="w-[1.125rem] h-[1.125rem] rounded-xl border border-border-dark accent-accent" />
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-md text-text-secondary-dark">{subject}</span>
                <div className="text-text-secondary-dark overflow-hidden">
                    <ReactMarkdown 
                        remarkPlugins={[remarkBreaks]} 
                        components={{
                            a({ children, href }) {
                            if (href === 'placeholder') {
                                return (
                                <span className="text-accent font-semibold">
                                    {children}
                                </span>
                                );
                            }
                            return <a href={href}>{children}</a>;
                            }
                        }}>
                            {body}
                    </ReactMarkdown>
                </div>
                <div className="flex items-center gap-3 justify-center">
                    {/* <TooltipWrapper tooltip={'Expand'}>
                        <div className="h-full flex items-center justify-center bg-background-primary rounded-lg border border-border-dark px-2 py-2 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow">
                            <ArrowRightIcon className="w-5 h-5 text-text-primary stroke-2 ms-[2px]"/>
                        </div>
                    </TooltipWrapper> */}
                    <Link to={`/email-templates/edit/${id}`} className="h-9 flex items-center justify-center gap-3 bg-background-primary rounded-lg border border-accent ps-4 pe-4 cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out small-button-shadow">
                        <PencilSquareIcon className="w-4 h-4 text-accent stroke-2" />
                        <span className="text-accent">Edit</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default EmailTemplateTableRow;