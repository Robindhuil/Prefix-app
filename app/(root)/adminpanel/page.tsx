import { redirect } from "next/navigation";
import { isAdmin } from "@/utils/auth";
import AdminPanel from "@/components/adminpanel/AdminPanel";

export default async function AdminPanelPage() {
    const admin = await isAdmin();

    if (!admin) {
        redirect("/");
    }

    return <AdminPanel />;
}