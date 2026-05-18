import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react";


type DataAlertDialogProps = {
    isButtonAlertDialog: boolean,
    buttonAlertDialog?: string;
    title: string;
    icon: LucideIcon
    description: string;
    buttonConfirm: string;
    buttonCancel: string;
    onClickConfirm: (isConfirm: boolean) => void
}

export default function AlertDialogComponents({
    isButtonAlertDialog,
    buttonAlertDialog,
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
        <AlertDialog>
            {
                isButtonAlertDialog == true &&
                    (
                        <AlertDialogTrigger asChild>
                            <Button className="w-full gap-x-4" variant="ghost">
                                <Icon />
                                {buttonAlertDialog}
                            </Button>
                        </AlertDialogTrigger>
                    )
            }
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{buttonCancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={onClickConfirmButton}>{buttonConfirm}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
