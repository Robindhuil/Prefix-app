export const runtime = "nodejs";

import LoginForm from "@/components/login/LoginForm";
import { signIn } from "@/lib/auth";
import { executeAction } from "@/lib/executeAction";
import { forgotPasswordAction } from "@/app/actions/auth";

export default function LoginPage() {
    const signInAction = async (formData: FormData) => {
        "use server";
        return await executeAction({
            actionFn: async () => {
                await signIn("credentials", {
                    username: formData.get("username"),
                    password: formData.get("password"),
                    redirect: false, // Handle redirect on client side
                });
            },
        });
    };

    // Simplify forgot password flow: call server action directly and return normalized result
    const forgotPasswordActionServer = async (email: string) => {
        "use server";
        try {
            const res = await forgotPasswordAction(email);
            if (res?.success) {
                return { success: true };
            }
            return { error: res.error || "SERVER_ERROR", errorKey: res.errorKey || "login.serverError" };
        } catch {
            return { error: "SERVER_ERROR", errorKey: "login.serverError" };
        }
    };

    const LoginFormAny = LoginForm as any;
    return <LoginFormAny signInAction={signInAction} forgotPasswordAction={forgotPasswordActionServer} />;
}