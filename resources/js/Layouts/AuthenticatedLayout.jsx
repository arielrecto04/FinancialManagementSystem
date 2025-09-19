import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ChatFloating from '@/Components/ChatFloating';


export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const navigationLinks = () => (
        <>
            <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                Dashboard
            </NavLink>

            {user.role === 'admin' && (
                <>
                    <NavLink href={route('statistics.index')} active={route().current('statistics.index')}>
                        Statistics
                    </NavLink>
                    <NavLink href={route('reports.index')} active={route().current('reports.index')}>
                        Reports
                    </NavLink>
                    <NavLink href={route('users.index')} active={route().current('users.index')}>
                        User Management
                    </NavLink>
                    <NavLink href={route('audit-logs.index')} active={route().current('audit-logs.index')}>
                        Audit Logs
                    </NavLink>
                </>
            )}

            {user.role === 'superadmin' && (
                <>
                    <NavLink href={route('petty-cash-requests.approvals')} active={route().current('petty-cash-requests.approvals')}>
                        Petty Cash Approvals
                    </NavLink>
                    <NavLink href={route('statistics.index')} active={route().current('statistics.index')}>
                        Statistics
                    </NavLink>
                    <NavLink href={route('reports.index')} active={route().current('reports.index')}>
                        Reports
                    </NavLink>
                    <NavLink href={route('users.index')} active={route().current('users.index')}>
                        User Management
                    </NavLink>
                    <NavLink href={route('audit-logs.index')} active={route().current('audit-logs.index')}>
                        Audit Logs
                    </NavLink>
                </>
            )}

            <NavLink href={route('request.form')} active={route().current('request.form')}>
                Request Forms
            </NavLink>

            <NavLink href={route('chat.index')} active={route().current('chat.index')}>
                Chat
            </NavLink>
        </>
    );

    const responsiveNavigationLinks = () => (
        <>
            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                Dashboard
            </ResponsiveNavLink>

            {user.role === 'admin' && (
                <div className="space-y-1">
                    <ResponsiveNavLink href={route('statistics.index')} active={route().current('statistics.index')}>
                        Statistics
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('reports.index')} active={route().current('reports.index')}>
                        Reports
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('users.index')} active={route().current('users.index')}>
                        User Management
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('audit-logs.index')} active={route().current('audit-logs.index')}>
                        Audit Logs
                    </ResponsiveNavLink>
                </div>
            )}

            {user.role === 'superadmin' && (
                <div className="space-y-1">
                    <ResponsiveNavLink href={route('petty-cash-requests.approvals')} active={route().current('petty-cash-requests.approvals')}>
                        Petty Cash Approvals
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('statistics.index')} active={route().current('statistics.index')}>
                        Statistics
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('reports.index')} active={route().current('reports.index')}>
                        Reports
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('users.index')} active={route().current('users.index')}>
                        User Management
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('audit-logs.index')} active={route().current('audit-logs.index')}>
                        Audit Logs
                    </ResponsiveNavLink>
                </div>
            )}

            <ResponsiveNavLink href={route('request.form')} active={route().current('request.form')}>
                Request Forms
            </ResponsiveNavLink>
        </>
    );



    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-100">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and Desktop Navigation */}
                        <div className="flex">
                            <div className="flex items-center shrink-0">
                                <Link href="/" className="flex items-center">
                                    <img
                                        src="/images/innovatologo.png"
                                        alt="Innovato Logo"
                                        className="w-auto h-10"
                                    />
                                </Link>
                            </div>

                            <div className="hidden sm:flex sm:items-center sm:ms-8 sm:space-x-4">
                                {navigationLinks()}
                            </div>
                        </div>

                        {/* User Dropdown - Desktop */}
                        <div className="hidden sm:flex sm:items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center text-sm font-medium text-gray-600 transition duration-150 ease-in-out hover:text-gray-800">
                                        <span>{user.name}</span>
                                        <svg className="w-4 h-4 ms-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Hamburger Menu Button */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex justify-center items-center p-2 text-gray-400 rounded-md transition duration-150 ease-in-out hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                            >
                                <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                    <div className="pt-2 pb-3 space-y-1">
                        {responsiveNavigationLinks()}
                    </div>

                    {/* Mobile User Info */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Adjusted spacing for fixed header */}
            <div className="pt-16">
                {header && (
                    <header className="bg-white shadow-sm">
                        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="min-h-screen">{children}</main>
            </div>
            <ChatFloating />
        </div>
    );
}
