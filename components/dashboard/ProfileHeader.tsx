// app/dashboard/[id]/components/ProfileHeader.tsx
import { User as LucideUser } from "lucide-react";

type User = {
    name?: string;
    username: string;
    role?: string;
};

export default function ProfileHeader({ user }: { user: User }) {
    return (
        <div className="bg-linear-to-r cl-bg-decor text-color rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-5">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <LucideUser className="w-12 h-12 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-white">
                        Ahoj, {user.name || user.username}!
                    </h1>
                    <p className="text-lg opacity-90 mt-1 text-white">
                        {user.role === "ADMIN" ? "Administrátor" : "Používateľ"}
                    </p>
                </div>
            </div>
        </div>
    );
}