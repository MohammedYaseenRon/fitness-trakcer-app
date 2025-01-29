"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { useSession } from "next-auth/react";


interface NutritionLog {
  id: number
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export default function NutritionTracker() {
  const { data: session, status } = useSession();

  const [log, setLog] = useState({
    userId: session?.user?.id || 0, // Use the userId from the session
    date: new Date().toISOString().split("T")[0],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch("/api/nutrition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    })
    if (response.ok) {
      toast.success("Nutrition log added!")
      fetchNutritionLogs()
    }
  }

  const fetchNutritionLogs = async () => {
    if (!session?.user?.id) {
      toast.error("Please log in to view your logs.")
      return
    }

    const userId = session.user.id // Get userId from session
    const response = await axios.get(`/api/nutrition?userId=${userId}`)
    console.log(response.data)
    if (response.status === 200) {
      setNutritionLogs(response.data)
      toast.success("Logs fetched successfully")
    } else {
      toast.error("Failed to fetch logs")
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchNutritionLogs()
    }
  }, [session?.user?.id])

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Log Nutrition</h2>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-sm p-4 bg-gray-100 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-[200px]">
            <label className="block mb-2">Date</label>
            <input
              type="date"
              value={log.date}
              onChange={(e) => setLog({ ...log, date: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="w-[200px]">
            <label className="block mb-2">Calories</label>
            <input
              type="number"
              value={log.calories}
              onChange={(e) => setLog({ ...log, calories: Number.parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-[200px]">
            <label className="block mb-2">Protein (g)</label>
            <input
              type="number"
              value={log.protein}
              onChange={(e) => setLog({ ...log, protein: Number.parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="w-[200px]">
            <label className="block mb-2">Carbs (g)</label>
            <input
              type="number"
              value={log.carbs}
              onChange={(e) => setLog({ ...log, carbs: Number.parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2">Fat (g)</label>
          <input
            type="number"
            value={log.fat}
            onChange={(e) => setLog({ ...log, fat: Number.parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Log Nutrition
        </button>
      </form>

      <h3 className="text-xl font-bold mb-4">Nutrition Log Summary</h3>
      <LineChart width={400} height={300} data={nutritionLogs}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="calories" stroke="#8884d8" />
        <Line type="monotone" dataKey="protein" stroke="#82ca9d" />
        <Line type="monotone" dataKey="carbs" stroke="#ffc658" />
        <Line type="monotone" dataKey="fat" stroke="#ff7300" />
      </LineChart>
    </div>
  )
}

