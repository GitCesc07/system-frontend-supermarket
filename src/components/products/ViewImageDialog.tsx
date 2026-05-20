import { useState } from "react";
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { X } from "lucide-react";

type ViewImageProps = {
    url_image: string,
    messageImage: string,
    onClose: () => void
};
export default function ViewImageDialog({ url_image, messageImage, onClose }: ViewImageProps) {
    const [urlImage] = useState(url_image);

    return (
        <DialogContent
            className="[&>button]:hidden w-[90%] md:w-[35%] h-auto sm:h-120 flex items-center justify-center"
            onPointerDownOutside={(event) => event.preventDefault()}
            onInteractOutside={(event) => event.preventDefault()}
        >
            <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="h-full w-full">
                {
                    messageImage == "" ?
                        (
                            <div className="flex items-center justify-center flex-col gap-y-2 w-full h-full">
                                <img loading="lazy" draggable="false" className="size-72 object-contain cursor-pointer" src={`${urlImage}`} alt="Image producto" />
                            </div>
                        )
                        :
                        <div className="flex items-center justify-center flex-col gap-y-2 w-full h-full">
                            <img loading="lazy" draggable="false" className="size-72 object-contain cursor-pointer" src={`${urlImage}`} alt="Image producto" />
                            <h3 className="font-bold text-center text-lg">{messageImage}</h3>
                        </div>
                }
            </div>
            <DialogClose
                onClick={() => {
                    onClose();
                }}
                className="absolute right-4 top-4"
                asChild
            >
                <X className="size-5" />
            </DialogClose>
        </DialogContent>
    )
}
