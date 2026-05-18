import type React from "react"

interface PropsErrorMessage {
    children: React.ReactNode;
}

export default function ErrorMessage({ children }: PropsErrorMessage) {
    return (
        <div className="mt-1 text-red-500 dark:text-red-400 font-bold text-[10px] uppercase">
            {children}
        </div>
    )
}
