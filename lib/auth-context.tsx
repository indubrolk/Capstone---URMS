"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    User,
    UserCredential,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "./firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<UserCredential>;
    signOut: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If Firebase is not configured (missing env variables), gracefully skip auth
        if (!auth) {
            setLoading(false);
            console.warn("Firebase Auth bypassed: Missing or invalid API key.");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe; // cleanup listener on unmount
    }, []);

    const signIn = async (email: string, password: string) => {
        if (!auth) throw new Error("Firebase is not initialized. Please check your .env variables.");
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    };

    const signOut = async () => {
        if (!auth) return;
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
