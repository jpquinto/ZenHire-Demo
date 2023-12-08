import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import axios from "axios";
import { User } from "@/types";

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

    const response = await axios.get(`${BACKEND_URL}/users/${userId}`);
    const user: User = response.data;
    if (user) {
        redirect(`/${userId}`);
    }

    return (
        <>
            <div className="pt-16">
                {children}
            </div>
        </>
    )
}