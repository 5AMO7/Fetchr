import { useState } from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import DividerLine from "./DividerLine";
import FilterAccordion from './FilterAccordion';
import SearchAccordion from './SearchAccordion';
import SocialMediaFilterAccordion from './SocialMediaFilterAccordion';
import { useFilters } from '../context/FilterContext';

function FilterSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { clearAllFilters, hasActiveFilters } = useFilters();

    // Industries available for filtering
    const industries = [
        "Waste Management", 
        "Solar Panels", 
        "Automation Machinery", 
        "Aviation",
        "Healthcare",
        "Real Estate",
        "Construction",
        "Information Technology",
        "Telecommunications",
        "Manufacturing",
        "Energy",
        "Financial Services",
        "Education",
        "Transportation"
    ];

    // Baltic cities for location filtering
    const locations = [
        // Lithuania
        "Vilnius",
        "Kaunas",
        "Klaipėda",
        "Šiauliai",
        "Panevėžys",
        // Latvia
        "Riga",
        "Daugavpils",
        "Liepāja",
        "Jelgava",
        "Jūrmala",
        // Estonia
        "Tallinn",
        "Tartu",
        "Narva",
        "Pärnu",
        "Kohtla-Järve"
    ];

    // Employee count categories
    const companySize = [
        "<10 employees",
        "10+ employees",
        "50+ employees",
        "100+ employees"
    ];

    return (
        <aside className={`bg-background-secondary p-3 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'} flex flex-col h-screen`}>
            <div className={`flex items-center justify-between ${isCollapsed ? 'px-0' : 'px-5'} pb-4`}>
                <span 
                    type="button" 
                    className='bg-background-primary border border-border-light p-[6px] rounded-lg small-button-shadow cursor-pointer'
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? 
                        <ArrowLeftIcon className="h-4 w-4 text-text-primary stroke-2" /> :
                        <ArrowRightIcon className="h-4 w-4 text-text-primary stroke-2" />
                    }
                </span>
                {!isCollapsed && 
                <div className='flex items-center justify-start w-full ps-6'>
                    <h2 className="flex items-center text-2xl font-medium text-text-primary">Filters</h2>
                    {hasActiveFilters() && (
                    <div className="flex justify-center items-center">
                        <button 
                            onClick={clearAllFilters}
                            className="flex items-center justify-center underline underline-offset-2 cursor-pointer bg-transparent hover:border-transparent text-accent hover:text-accent-dark transition-all duration-300 ease-in-out text-sm"
                        >
                            Clear
                        </button>
                    </div>
                )}
                </div>
                }
                
            </div>
            
            {!isCollapsed && (
                <>
                    <DividerLine width="w-[19rem]" />
                    <div className="mt-4 px-1 flex-grow relative">
                        <div className="absolute inset-0 overflow-y-auto overflow-x-visible pr-1">
                            <SearchAccordion title="Company Name" />
                            <FilterAccordion 
                                title="Industry" 
                                options={industries} 
                                filterCategory="industries" 
                            />
                            <FilterAccordion 
                                title="Location" 
                                options={locations} 
                                filterCategory="locations" 
                            />
                            <FilterAccordion 
                                title="Company Size" 
                                options={companySize} 
                                filterCategory="employeeCount" 
                            />
                            <SocialMediaFilterAccordion />
                        </div>
                    </div>
                </>
            )}
        </aside>
    );
}

export default FilterSidebar;