"use server"
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers"

export async function signInAdmin(email: string, password: string) {
    try {
        if (!email || !password) {
            return { success: false, error: 'Email or password is missing' }
        }

        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            return { success: false, error: "Admin not found" };
        }

        // Compare password
        const isValid = password === admin.password;
        if (!isValid) {
            return { success: false, error: "Invalid password" };
        } else {
            (await cookies()).set("adminAuthenticated", "true", {
                httpOnly: true,
                path: "/",
                sameSite: "lax",
                maxAge: 60 * 60, // 1 hour
            });
            (await cookies()).set("adminUser", admin.email, {
                httpOnly: true,
                path: "/",
                sameSite: "lax",
                maxAge: 60 * 60, // 1 hour
            })
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to sign in admin:", error);
        return { success: false, error: "Internal server error" };
    }
}
