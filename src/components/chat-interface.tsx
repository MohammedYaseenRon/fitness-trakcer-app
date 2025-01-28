"use client"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    api: "/api/chat",
    onError: (err) => {
      toast.error(err.message)
    },
  })
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/chat-history")
      .then((res) => res.json())
      .then((data) => setChatHistory(data))
      .catch((err) => toast.error("Failed to load chat history"))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, []) // Removed unnecessary dependency: messages

  return (
    <Card className="w-80 h-96 fixed bottom-20 right-4 flex flex-col">
      <CardHeader>
        <CardTitle>Chat with AI</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        {chatHistory.map((m) => (
          <div key={m.id} className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded-lg ${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {m.content}
            </span>
          </div>
        ))}
        {messages.map((m) => (
          <div key={m.id} className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded-lg ${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {m.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input value={input} onChange={handleInputChange} placeholder="Type your message..." />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  )
}

