import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function ToogleFieldsDialogKardex({ showFields, setShowFields }: { showFields: string[], setShowFields: (fields: string[]) => void }) {
    const [allFields] = useState<string[]>([
        "Fecha creación",
        "Descripción",
        "Nombre producto",
        "Tipo",
        "Cantidad entrada",
        "Precio entrada",
        "Total entrada",
        "Cantidad salida",
        "Precio salida",
        "Total salida",
        "Cantidad disponible",
        "Precio disponible",
        "Total disponible"
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
            <DialogTrigger>
                <Button variant="outline" className="cursor-pointer w-full md:w-auto flex items-center justify-center gap-x-4">
                    <Eye className="size-5" />
                    Mostrar campos
                </Button>
            </DialogTrigger>
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
                        <Button
                            variant="outline"
                            type="submit"
                            className="w-full md:w-auto flex items-center justify-center gap-x-4 font-bold"
                            aria-label="Close"
                            onClick={handleSave}
                        >
                            <Save className="size-5" />
                            Guardar configuraciones
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
