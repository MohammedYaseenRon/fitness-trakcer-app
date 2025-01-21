"use client";

import React,{useState} from "react";
import { useRouter,usePathname } from "next/navigation"
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Building2,
    ShieldCheck,
    User,
    Settings,
    LogOut,
    Bell,
    Building,
    UserCircle,
    Heart,
    BriefcaseBusiness,
    Umbrella,
    Mail,
  } from "lucide-react";
  import Link from "next/link";

  interface UserData {
    id: string;
    email: string;
    user_type: string;
    name?: string;
    user_name?: string;
  }


export const SideBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [notifications, setNotifications] = useState(0); // Mock notification count
    const [userData,setUserData] = useState<UserData | null>(null)
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: Building2 },
        {
          href: "/workout",
          label: "Workout",
          icon: ShieldCheck,
        },
        { href: "/nutrition", label: "Nutrition", icon: BriefcaseBusiness },
        { href: "/diet", label: "Diet", icon: BriefcaseBusiness },
        { href: "/goal", label: "Goal setting", icon: UserCircle },
    ]

      const handleSignOut = (e:React.FormEvent) => {
        e.preventDefault();
        console.log("form submitted");
      }

    return (
        <div
            className={`flex h-screen flex-col justify-between border-r bg-white transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            <div>
                <div className="flex items-center justify-between p-6">
                    {!isCollapsed && (
                        <Image
                            src="/logo.svg"
                            alt="COVERFi Logo"
                            width={150}
                            height={40}
                            className="h-full"
                        />
                    )}
                    {isCollapsed && (
                        <Image
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            src="/logo-sm.svg"
                            alt="COVERFi Logo"
                            width={150}
                            height={40}
                            className="h-full lg:hidden"
                        />
                    )}
                </div>

                <nav className="space-y-1 px-3">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <TooltipProvider key={item.href}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors ${isActive
                                                    ? "bg-[#e8efed] text-[#1b5445] font-extrabold"
                                                    : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            <item.icon className="h-5 w-5 flex-shrink-0" />
                                            {!isCollapsed && item.label}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" sideOffset={20}>
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full justify-start p-2 relative bg-[#e8efed] py-6"
                        >
                            <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback className="bg-[#1b5445] text-white">
                                    {/* {userData.email.charAt(0).toUpperCase()} */}
                                </AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <div className="flex flex-col items-start">
                                    <span className="text-sm font-medium">
                                        {/* {userData.user_name || "User"} */}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {/* {userData.email} */}
                                    </span>
                                </div>
                            )}
                            {/* {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1"
                    >
                      {notifications}
                    </Badge>
                  )} */}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuItem onClick={() => router.push("/profile")}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>App Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                  {notifications > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {notifications}
                    </Badge>
                  )}
                </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}