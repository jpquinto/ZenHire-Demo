import Navbar from "@/components/navbar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <>
            <Navbar />
            <div className="pt-16">
                {children}
            </div>
        </>
    )
}