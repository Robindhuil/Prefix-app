import ResetPasswordForm from "@/components/login/ResetPasswordForm";

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string; token?: string }>;
}) {
    const { email = "", token = "" } = await searchParams;

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="absolute inset-0 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 -z-10" />
            <div className="relative w-full max-w-md px-4 sm:px-6 lg:px-8">
                <div className="bg-card backdrop-blur-xl rounded-2xl shadow-xl border-custom p-8">
                    <h2 className="text-2xl font-bold text-color mb-2">Reset password</h2>
                    <p className="text-color opacity-70 mb-6">
                        Enter a new password for your account. Links expire after 30 minutes.
                    </p>

                    <ResetPasswordForm email={email} token={token} />
                </div>
            </div>
        </div>
    );
}
