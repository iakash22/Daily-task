import React from 'react'
import Logo from './Logo'
import {UserButton} from '@clerk/nextjs';
import ThemeSwitcher from './ThemeSwitcher';

const NavBar = () => {
    return (
        <div 
            className='w-full flex flex-row justify-between items-center p-4 px-8 h-[60px]'
        >
            <Logo />
            <div 
                className='flex flex-row gap-4 items-center'>
                <UserButton 
                    afterSignOutUrl='/'
                />
                <ThemeSwitcher />
            </div>
        </div>
    )
}

export default NavBar;
