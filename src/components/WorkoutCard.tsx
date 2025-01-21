import React,{useState} from "react";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";



interface WorkoutCardsProps {
  title: string;
  description: string;
  duration: string; // Changed to string for flexibility
  difficulty: string;
  goals:string;
  body:string;
}

interface ModalProps {
    id?: string | null;
    isOpen: boolean;
    onClose: () => void;
    name: string;
    width?:string;
    height?:string
    className?:string
  
}

export default function WorkoutCards({
    isOpen, onClose, name,className 
}: ModalProps) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string | null>(null);
    const [formData, setFormData] = useState<WorkoutCardsProps>({
      title: "",
      description: "",
      duration: "",
      difficulty: "",
      goals: "",
      body: "",
  
    })

    const handleInputChange =  (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name,value} = e.target;
        setFormData((prev => ({...prev, [name]:value})))

    }
  return (
    <Modal isOpen={isOpen} onClose={onClose} name={name}>
      <form  className="space-y-6 p-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700" htmlFor="projectName">Workout Title</Label>
          <Input
            id="workout"
            name="workout"
            placeholder='Enter a workout name'
            value={formData.title}
            onChange={handleInputChange}
            className='w-[400px] h-[50px] text-black'
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700" htmlFor="projectDescription">Description</Label>
          <Textarea
            id="workoutDescription"
            name="workoutDescription"
            placeholder='Enter a workout description'
            value={formData.description}
            onChange={handleInputChange}
            className='w-[500px] h-[50px] text-black'
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700" htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            name="duration"
            placeholder='Enter a duration'
            value={formData.duration}
            onChange={handleInputChange}
            className='w-[400px] h-[50px] text-black'
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700" htmlFor="techStack">Workout Difficulty</Label>
            <Input
              id="difficulty"
              name="difficulty"
              placeholder='Difficulty'
              value={formData.difficulty}
              onChange={handleInputChange}
              className='w-full h-[50px] text-black'
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700" htmlFor="livedemo">Set Goals</Label>
            <Input
              id="goals"
              name="goals"
              placeholder='Goals'
              value={formData.goals}
              onChange={handleInputChange}
              className='w-full h-[50px] text-black'
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700" htmlFor="sourcecode">Body Part</Label>
          <Input
            id="bodyPart"
            name="bodyPart"
            placeholder='Body Part'
            value={formData.body}
            onChange={handleInputChange}
            className="w-[400px] h-[50px] text-black"
          />
        </div>
        <div className='flex flex-row-reverse'>
          <Button type="submit" className="w-full h-[50px]" disabled={loading}>
            Create Workout Plan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
