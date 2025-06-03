import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronUpDownIcon, ArrowLeftStartOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from '../context/AuthContext';

function UserCard({onProfileClick}) {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
    await logout();
    };

    return (
        <Menu as="div" className="relative w-full h-full p-0">
            <MenuButton className="flex w-full h-full bg-background-primary cursor-pointer hover:bg-dark-primary transition-all duration-300 ease-in-out select-none large-button-shadow rounded-xl py-3 ps-0 pe-3 items-center justify-end hover:border-transparent">
                    <div className="flex items-center justify-center h-full px-3">
                        <div className="w-12 h-12 bg-text-secondary rounded-full"></div>
                    </div>
                    <div className="flex flex-col justify-center items-stretch">
                        <span className="text-text-primary text-xl text-start">{user.name} {user.lastname}</span>
                        <span className="text-text-secondary text-start text-xs">{user.email}</span>
                    </div>
                    <div className="ms-auto">
                        <ChevronUpDownIcon className="h-6 w-6 text-text-secondary" />
                    </div>
            </MenuButton>

            <MenuItems className="absolute left-0 -top-32 mb-20 z-10 mt-2 w-full origin-top-right rounded-md bg-white large-button-shadow border border-border-dark focus:outline-none">
                <div className="py-1">
                    <MenuItem className="bg-white hover:border-transparent hover:bg-dark-primary transition-all duration-300 ease-in-out select-none">
                        {({ active }) => (
                            <button
                                onClick={onProfileClick}
                                className={`${
                                    active ? 'bg-gray-100' : ''
                                } flex items-center justify-start gap-2 w-full px-4 py-3 text-md font-normal text-left text-text-primary`}
                            >
                                <UserCircleIcon className='h-5 w-5 text-text-primary stroke-2' />
                                Profile
                            </button>
                        )}
                    </MenuItem>
                    <MenuItem className="bg-white hover:border-transparent hover:bg-dark-primary transition-all duration-300 ease-in-out select-none">
                        {({ active }) => (
                            <button
                                onClick={handleLogout}
                                className={`${
                                    active ? 'bg-gray-100' : ''
                                } flex items-center justify-start gap-2 w-full px-4 py-3 text-md font-normal text-left text-text-danger`}
                            >
                                <ArrowLeftStartOnRectangleIcon className='h-5 w-5 text-text-danger stroke-2' />
                                Sign out
                            </button>
                        )}
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu>
    );
}

export default UserCard;