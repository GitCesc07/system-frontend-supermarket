import React from "react"

interface PropsChildren {
    children: React.ReactNode;
}

export default function BackGroundGradient({ children }: PropsChildren) {
    return (
        <div className="bg-linear-to-b dark:from-gray-700 from-gray-200 dark:via-gray-900 via-gray-400 to-black h-full w-full flex items-center justify-center p-4">
            <div className="border-2 rounded-lg shadow-lg shadow-gray-800 dark:border-gray-700 dark:bg-gray-800 w-full sm:w-[70%] md:w-[50%] lg:w-[30%] xl:w-[25%] flex items-center justify-center h-auto">
                {children}
            </div>
        </div>
    )
}
