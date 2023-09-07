import { Toaster } from '@/components/ui/toaster'
import React, { ReactNode } from 'react'

const layout = ({children } : {children : ReactNode}) => {
    return (
        <div className='flex flex-col items-center min-h-screen w-full'>
            <div className='w-full flex flex-grow justify-center dark:bg-neutral-950'>
                <div className='max-w-[950px] flex flex-col flex-grow px-4 py-12'>
                    {children}
                    <Toaster />
                </div>
            </div>
        </div>
    )
}

export default layout
