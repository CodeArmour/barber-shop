"use server"
import { prisma } from "@/lib/prisma";

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
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to sign in admin:", error);
        return { success: false, error: "Internal server error" };
    }
}
