import { useTranslation } from "@/app/i18n/I18nProvider";
import AdminInfo from "./admin/AdminInfo";

export default function AdminSection() {
    const { t } = useTranslation();

    return (
        <div className="text-center p-6">
            <div className="text-left">
                <AdminInfo />
            </div>
        </div>
    );
}
