"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from "@/components/ui/select";
import WorkoutCards from "@/components/WorkoutCard";
import { useState } from "react";
import { MdHealthAndSafety } from "react-icons/md";


export default function () {
    const [workoutData,setWorkoutData] = useState("");
    const [isModalOpen,setIsModalOpen] = useState(false);


    const handleOpenModal = () => {
        setIsModalOpen(true);
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }
    return (
        <div className="p-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">My workouts</h1>
                <div className="flex items-center gap-6">
                    <div className="text-lg font-medium bg-white text-black border border-black rounded-lg mt-6">
                        <Select
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter workouts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="+91">+91</SelectItem>
                                <SelectItem value="+91">+91</SelectItem>
                                <SelectItem value="+91">+91</SelectItem>
                                <SelectItem value="+91">+91</SelectItem>
                                <SelectItem value="+91">+91</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Button
                            onClick={handleOpenModal}
                            className="text-lg font-medium bg-white text-black border border-black rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-black hover:text-white hover:border-transparent transition-all duration-300 mt-6"
                        >
                            <MdHealthAndSafety className="w-6 h-6" />
                            <span className="text-base">Create Your's</span>
                        </Button>
                    </div>

                    <div>
                        <Label>Search</Label>
                        <Input
                            id="search"
                            type="text"
                            className="w-[200px] bg-white text-black border border-black"
                            placeholder="Search your workout plan"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">

                    </div>
                </div>
            </div>
            <WorkoutCards
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              name="Create workout"
              className=""
            />

        </div>
    )
}