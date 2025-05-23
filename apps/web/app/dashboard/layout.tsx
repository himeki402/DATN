import { Header } from "@/components/common/layout/header";
import { Footer } from "@/components/common/layout/footer";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main className="min-h-screen">
                <Header showSearch={false} />
                {children}
                <Footer />
            </main>
        </>
    );
}
