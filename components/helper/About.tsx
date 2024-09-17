// Example usage in a parent component or page
import React from "react";
import { Info } from "../Landing/Info";

export const About: React.FC = () => {
  return (
    <div>
      <Info
        title="Achieve Your Fitness Goals"
        description="Explore our app's features to set and track your fitness goals effectively. Stay motivated and reach new milestones with our comprehensive tools."
        imageSrc="/Assets/fitness2.png"
        imageAlt="A person exercising"
      />
    </div>
  );
};

