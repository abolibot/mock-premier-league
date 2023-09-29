import { object, string } from "zod";

export const userSignup = object({
    body: object({
        first_name: string({
            required_error: "First name is required",
        }),
        last_name: string({
            required_error: "Last name is required",
        }),
        email: string({
            required_error: "Email address is required",
        }).email("Invalid email address"),
        password: string({
            required_error: "Password is required",
        })
            .min(8, "Password must be more than 8 characters")
            .max(32, "Password must be less than 32 characters"),
        password_confirm: string({
            required_error: "Please confirm your password",
        }),
    }).refine((data) => data.password === data.password_confirm, {
        path: ["password_confirm"],
        message: "Passwords do not match",
    }),
});

export const userSignin = object({
    body: object({
        email: string({
            required_error: "Email address is required",
        }).email("Invalid email address"),
        password: string({
            required_error: "Password is required",
        }).min(1, { message: "Password cannot be empty" }),
    }),
});
