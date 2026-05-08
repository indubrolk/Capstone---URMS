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
import { getUserProfile, UserProfile } from "./supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<UserCredential>;
    signOut: () => Promise<void>;
    setMockUser: (role: UserProfile["role"]) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            console.warn("Firebase Auth bypassed: Missing or invalid API key.");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                const userProfile = await getUserProfile(firebaseUser.uid);
                setProfile(userProfile);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signIn = async (email: string, password: string) => {
        if (!auth) throw new Error("Firebase is not initialized.");
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string) => {
        if (!auth) throw new Error("Firebase is not initialized.");
        return await createUserWithEmailAndPassword(auth, email, password);
    };

    const signOut = async () => {
        if (!auth) return;
        await firebaseSignOut(auth);
        setProfile(null);
        setUser(null);
    };

    const setMockUser = (role: UserProfile["role"]) => {
        // This is just for UI demonstration/demo purposes
        const mockProfile: UserProfile = {
            id: `mock-${role}`,
            name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
            email: `${role}@demo.lk`,
            role: role,
            created_at: new Date().toISOString()
        };
        setProfile(mockProfile);
        // We set a fake user object to pass ProtectedRoute checks
        setUser({ uid: mockProfile.id, email: mockProfile.email } as User);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, setMockUser }}>
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
