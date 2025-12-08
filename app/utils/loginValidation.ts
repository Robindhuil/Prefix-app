interface ValidationErrors {
    [key: string]: string;
}

interface LoginFormData {
    username: string;
    password: string;
}

export const validateLoginForm = (data: LoginFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!data.username.trim()) {
        errors.username = 'login.usernameRequired';
    } else if (data.username.length < 3) {
        errors.username = 'login.usernameMinLength';
    }

    if (!data.password) {
        errors.password = 'login.passwordRequired';
    } else if (data.password.length < 6) {
        errors.password = 'login.passwordMinLength';
    }

    return errors;
};

// Add a basic email validator for forgot password flow
export const validateEmail = (email: string): string | undefined => {
    const trimmed = email.trim();
    if (!trimmed) return "login.errors.emailRequired";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return "login.errors.emailInvalid";
    return undefined;
};
