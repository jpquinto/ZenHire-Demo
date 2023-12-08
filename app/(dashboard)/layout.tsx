import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import axios from "axios";
import { User } from "@/types";
import Navbar from "@/components/navbar";

const BACKEND_URL = process.env.BACKEND_URL || "";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    return (
        <>
            <Navbar userId={userId} />
            <div className="pt-16">
                {children}
            </div>
        </>
    )
}