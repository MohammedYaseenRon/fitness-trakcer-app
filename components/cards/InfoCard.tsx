import React from "react"
import { IconType } from "react-icons"

interface InfoCardProps {
    data:{
        icon:IconType;
        label: string;
        desc:string;
    }
} 


export const InfoCard: React.FC<InfoCardProps> =  ({data}) => {
    const Icon = data.icon
    return (
        <div className="bg-white rounded-3xl shadow-xl p-10">
            <div className="grid gap-10 place-items-center">
                <div className="p-4 rounded-full bg-orange-100 shadow-lg">
                    <Icon className="h-8 w-8 text-orange-600"/>
                </div>
                <p className="text-2xl text-blue-400 text-center">{data.label}</p>
                <p className="text-center">{data.desc}</p>
            </div>
        </div>
    )
}