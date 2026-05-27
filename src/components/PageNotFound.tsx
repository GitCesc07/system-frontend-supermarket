import { Home } from "lucide-react";

export default function PageNotFound() {
    return (
        <div className="bg-linear-to-b dark:from-gray-700 from-gray-200 dark:via-gray-900 via-gray-400 to-slate-600 dark:to-black h-full w-full flex items-center justify-center py-20 px-4 md:p-8">
            <section className="flex items-center justify-start h-full w-full space-y-4 flex-col">
                <h3 className="font-bold text-6xl md:text-8xl">404</h3>
                <img className="size-36 md:size-60 object-fill" loading="lazy" src="page-not-found.svg" alt="image-bg" />
                <h3 className="font-bold text-xl md:text-2xl w-full md:w-[35%] text-center mx-auto">Upss...  <span className="text-lg md:text-xl"> La página que estabas buscando no se encontro, o no existe.</span></h3>
                <a
                href="/"
                className="border border-gray-300 dark:border-gray-700 flex items-center justify-center gap-x-6 py-2 px-4 rounded-lg font-bold uppercase"
                >
                    <Home className="size-5" />
                    Regresar a inicio
                </a>
            </section>
        </div>
    )
}
