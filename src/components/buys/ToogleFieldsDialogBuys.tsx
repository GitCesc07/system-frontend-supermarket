import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Save } from "lucide-react";
import { useState } from "react";

export default function ToogleFieldsDialogBuys({ showFields, setShowFields }: { showFields: string[], setShowFields: (fields: string[]) => void }) {
    const [allFields] = useState<string[]>([
        "Número compra",
        "Número factura proveedor",
        "Termino",
        "Estado",
        "Observaciones",
        "Subtotal",
        "Total",
        "Proveedor",
        "Fecha creación",
        "Fecha modificación",
        "Usuario creador",
        "Usuario modificador"
    ]);
    const [localShowFields, setLocalShowFields] = useState(showFields)

    const handleToggle = (field: string) => {
        if (localShowFields.includes(field)) {
            setLocalShowFields(localShowFields.filter(f => f !== field))
        } else {
            setLocalShowFields([...localShowFields, field])
        }
    }

    const handleSave = () => {
        setShowFields(localShowFields)
    }
    return (
        <Dialog>
            <DialogTrigger className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 py-1 px-2 rounded-lg cursor-pointer w-full md:w-auto">Mostrar campos</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Mostrar u Ocultar</DialogTitle>
                    <DialogDescription>
                        Muestra u oculta campos de la tabla...
                    </DialogDescription>
                    {allFields?.map((field) => (

                        <div key={field} className="flex items-center">
                            <input
                                id={`toggle-${field}`}
                                type="checkbox"
                                checked={localShowFields.includes(field)}
                                onChange={() => handleToggle(field)}
                                className="mr-2"
                            />
                            <label htmlFor={`toggle-${field}`}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                        </div>
                    ))}
                    <div className="mt-6.25 flex justify-center">
                        <button
                            type="submit"
                            className="w-full md:w-auto border bg-gray-200 dark:bg-mist-900 border-gray-300 dark:border-gray-800 py-2 px-4 rounded-md flex items-center justify-center gap-x-4 font-bold"
                            aria-label="Close"
                            onClick={handleSave}
                        >
                            <Save className="size-5" />
                            Guardar configuraciones
                        </button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
