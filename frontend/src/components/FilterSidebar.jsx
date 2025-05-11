import { ArrowRightIcon } from "@heroicons/react/24/outline";

function FilterSidebar() {
    return (
        <aside className="bg-background-secondary p-3">
            <div className="flex items-center justify-between px-5 pb-4">
                <span type="button" className='bg-background-primary border border-border-light p-[6px] rounded-lg small-button-shadow'>
                    <ArrowRightIcon className="h-4 w-4 text-text-primary stroke-2" />
                </span>
                <h2 className="text-2xl font-medium text-text-primary">Filters</h2>
            </div>
            <hr className='w-[19rem] h-px border border-border-medium'/>
        </aside>
    );
}

export default FilterSidebar;