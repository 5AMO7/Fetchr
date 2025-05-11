
function NavItem({ icon: Icon, text }) {
    return (
        <div className="flex items-center py-2 pb-3 select-none cursor-pointer hover:bg-dark-secondary transition-all duration-300 ease-in-out rounded-xl">
            {Icon && <Icon className="h-5 w-5 text-text-primary stroke-2 ms-[1.1rem] me-[1.1rem]" />}
            <span className="text-text-primary text-xl">{text}</span>
        </div>
    );
}

export default NavItem;