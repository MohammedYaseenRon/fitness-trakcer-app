import React from "react";
import Image from "next/image";

interface InfoProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export const Info: React.FC<InfoProps> = ({ title, description, imageSrc, imageAlt }) => {
  return (
    <div className="py-10 px-12 lg:px-32 lg:py-20 flex flex-col lg:flex-row gap-16 items-center justify-center">
      <div className="grid gap-4">
        <p className="text-4xl font-semibold font-frank text-blue-500 leading-8">{title}</p>
        <p className="text-2xl text-gray-500">{description}</p>
      </div>
      <div className="flex-1">
        <div className="relative w-[500px] h-[400px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  );
};