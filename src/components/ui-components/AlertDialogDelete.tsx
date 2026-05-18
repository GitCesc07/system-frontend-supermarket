import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import type { LucideIcon } from "lucide-react";


type DataAlertDialogProps = {
    title: string;
    icon: LucideIcon
    description: string;
    buttonConfirm: string;
    buttonCancel: string;
    onClickConfirm: (isConfirm: boolean) => void
}

export default function AlertDialogDelete({
    title,
    icon: Icon,
    description,
    buttonConfirm,
    buttonCancel,
    onClickConfirm
}: DataAlertDialogProps) {
    const onClickConfirmButton = () => {
        onClickConfirm(true);
    }
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <div className="flex items-center justify-center w-full">
                    <Icon className="size-14" />
                </div>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>{buttonCancel}</AlertDialogCancel>
                <AlertDialogAction onClick={onClickConfirmButton}>{buttonConfirm}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}
