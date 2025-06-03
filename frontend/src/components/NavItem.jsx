import { NavLink } from 'react-router-dom';

function NavItem({ icon: Icon, text, path }) {
    return (
        <NavLink to={path} className={({ isActive }) => `flex items-center pt-3 pb-3 select-none transition-all duration-300 ease-in-out rounded-xl 
        ${ isActive ? 'bg-background-primary text-accent hover:text-accent cursor-default small-button-shadow' : 'bg-background-secondary text-text-primary hover:text-text-primary cursor-pointer hover:bg-dark-secondary'}`
        }>
            {Icon && <Icon className="h-5 w-5 stroke-2 ms-[1.1rem] me-[1.1rem]" />}
            <span className="text-xl font-normal">{text}</span>
        </NavLink>
    );
}

export default NavItem;