import { SideBar } from '@/components/SideBar'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Your Fitness App',
  description: 'Your personal fitness companion',
}

// Define the props for the Layout component
interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <main className="flex-1 bg-[#F8F9FC]">{children}</main>
      </div>
    </div>
  );
};

