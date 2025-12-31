"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

interface ImageUploadProps {
    images: File[];
    onImagesChange: (images: File[]) => void;
    maxImages: number;
    disabled?: boolean;
    required?: boolean;
}

export function ImageUpload({
    images,
    onImagesChange,
    maxImages,
    disabled,
    required,
}: ImageUploadProps) {
    const t = useTranslations("common.modelPlayground");
    const [isDragging, setIsDragging] = React.useState(false);
    const [showLimitDialog, setShowLimitDialog] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        processFiles(newFiles);
    };

    const processFiles = (newFiles: File[]) => {
        const validFiles: File[] = [];
        let hasError = false;

        newFiles.forEach((file) => {
            if (!file.type.startsWith("image/")) {
                toast.error(t("toasts.onlyImagesAllowed"));
                hasError = true;
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(t("toasts.fileSizeLimit", { name: file.name }));
                hasError = true;
                return;
            }
            validFiles.push(file);
        });

        if (images.length + validFiles.length > maxImages) {
            setShowLimitDialog(true);
            return;
        }

        if (validFiles.length > 0) {
            onImagesChange([...images, ...validFiles]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        handleFileChange(e.dataTransfer.files);
    };

    const handlePaste = React.useCallback(
        (e: ClipboardEvent) => {
            if (disabled) return;
            const items = e.clipboardData?.items;
            if (!items) return;

            const pastedFiles: File[] = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    const file = items[i].getAsFile();
                    if (file) pastedFiles.push(file);
                }
            }

            if (pastedFiles.length > 0) {
                processFiles(pastedFiles);
            }
        },
        [disabled, images, maxImages]
    );

    React.useEffect(() => {
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [handlePaste]);

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onImagesChange(newImages);
    };

    return (
        <>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground flex justify-between">
                    <span>
                        {t("controls.referenceImageLabel")}
                        {required ? <span className="text-destructive ml-1">*</span> : <span className="text-muted-foreground ml-1 text-xs font-normal">({t("controls.optional")})</span>}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {images.length}/{maxImages}
                    </span>
                </label>

                <div
                    className={cn(
                        "relative group flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed transition-all duration-200",
                        isDragging
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50",
                        disabled && "opacity-50 cursor-not-allowed hover:border-muted-foreground/25 hover:bg-transparent",
                        images.length > 0 ? "p-4" : "h-32"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e.target.files)}
                        disabled={disabled}
                    />

                    {images.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center gap-2">
                            <div className="p-3 rounded-full bg-muted">
                                <Upload className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm font-medium text-foreground">
                                    {t("controls.clickOrDrag")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {t("controls.uploadConstraints", { maxImages })}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full" onClick={(e) => e.stopPropagation()}>
                            {images.map((file, index) => (
                                <div key={index} className="relative group/image aspect-square rounded-lg overflow-hidden border bg-background">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Upload ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white transition-colors hover:bg-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {images.length < maxImages && (
                                <div
                                    className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-colors"
                                    onClick={() => !disabled && fileInputRef.current?.click()}
                                >
                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-[10px] text-muted-foreground mt-1">{t("controls.addImage")}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("dialogs.uploadLimitTitle")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("dialogs.uploadLimitDescription", { maxImages })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowLimitDialog(false)}>
                            {t("dialogs.understoodAction")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
