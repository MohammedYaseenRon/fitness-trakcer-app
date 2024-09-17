import React from "react";

interface FooterProps {
    tagline?: string;
}

export const Footer:React.FC<FooterProps> = ({tagline = "Virtual Training Platform"}) => {
    return (
        <div
        id="Contact"
        className="bg-gradient-to-r from-purple-700 to-blue-500 grid gap-8 place-content-center place-items-center py-14"
      >
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
         
          <div className="hidden md:block border-white border-l-2 h-10" />
          <p className="text-orange-200 text-lg md:text-xl font-semibold">
            {tagline}
          </p>
        </div>
        <p className="text-orange-200 md:text-xl font-semibold">
            Lorem ipsum dolor sit amet consectetur adipisicing.
        </p>
        <p className="text-white">&copy; {new Date().getFullYear()}Inc.</p>
      </div>
    )
}
