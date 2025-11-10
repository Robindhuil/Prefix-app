// app/dashboard/[id]/components/ProfileHeader.tsx
import { User } from "lucide-react";

export default function ProfileHeader({ user }: any) {
    return (
        <div className="bg-linear-to-r bg-[#600000] text-color rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-5">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <User className="w-12 h-12" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold">
                        Ahoj, {user.name || user.username}!
                    </h1>
                    <p className="text-lg opacity-90 mt-1">
                        {user.role === "ADMIN" ? "👑 Administrátor" : "👤 Používateľ"}
                    </p>
                </div>
            </div>
        </div>
    );
}