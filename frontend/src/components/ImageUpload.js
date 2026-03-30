"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ImageUpload = ({ value = [], onChange, maxFiles = 4 }) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!value?.length) {
      setPreviews([]);
      return;
    }

    const mapped = value.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPreviews(mapped);

    return () => {
      mapped.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const merged = [...value, ...acceptedFiles].slice(0, maxFiles);
      onChange(merged);
    },
    [value, onChange, maxFiles],
  );

  const removeImage = (index) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: maxFiles,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`max-w-80 h-60 border-2 border-dashed ${
        isDragActive
          ? "border-accent bg-accent/20"
          : "border-muted-foreground/20 bg-background"
      } p-2 transition-all duration-300 cursor-pointer`}
    >
      <Input {...getInputProps()} />
      {previews.length === 0 ? (
        <div className="text-center space-y-1 p-10">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <>
              <Button
                variant="outline"
                type="button"
                aria-label="Add file"
                className="cursor-pointer"
              >
                Add file
              </Button>
              <p className="text-xs">Or drag & drop files here</p>
            </>
          )}
        </div>
      ) : (
        <div
          className={`grid ${
            previews.length === 1 ? "grid-cols-1" : "grid-cols-2"
          } gap-2`}
        >
          {previews.map((item, i) => (
            <div key={i} className="relative group">
              <Image
                src={item.preview}
                width={200}
                height={100}
                alt={`Preview ${i}`}
                className="w-full aspect-video object-cover rounded-md border border-border"
              />
              <Button
                variant="secondary"
                size="icon-sm"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(i);
                }}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
