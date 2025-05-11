function NavGroup({title, children}) {
    return (
        <div>
            <span className="text-text-secondary text-md ps-4">{title}</span>
            <div className="flex flex-col gap-1 pt-1">
                {children}
            </div>
        </div>
    );
}

export default NavGroup;