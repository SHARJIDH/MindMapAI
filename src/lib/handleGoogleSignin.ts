"use server"

import { signIn, signOut } from "@/auth";

export const handleGoogleSignIn = async () => {
    try {
        await signIn("google", {
            callbackUrl: "/",
            redirect: true
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const handleCommonSignOut = async () => {
    try {
        console.log("Signing out");
        await signOut({
            callbackUrl: "/auth/login",
            redirect: true
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}