/**
 * Basic sanity test: verifies Firebase initializes with the expected config shape.
 * Uses mocks so no real Firebase project is needed in CI.
 */

// ─── Mock Firebase modules ────────────────────────────────────────────────────

const mockInitializeApp = jest.fn().mockReturnValue({ name: "[DEFAULT]" });
const mockGetApps = jest.fn().mockReturnValue([]); // simulate first init
const mockGetAuth = jest.fn().mockReturnValue({ currentUser: null });

jest.mock("firebase/app", () => ({
    initializeApp: mockInitializeApp,
    getApps: mockGetApps,
}));

jest.mock("firebase/auth", () => ({
    getAuth: mockGetAuth,
}));

// ─── Set env vars before module import ───────────────────────────────────────

beforeAll(() => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test-api-key";
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "test-project.firebaseapp.com";
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "test-project";
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "test-project.appspot.com";
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "123456789";
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "1:123456789:web:abcdef";
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("lib/firebase", () => {
    let firebaseModule: typeof import("@/lib/firebase");

    beforeEach(async () => {
        jest.resetModules();
        // Re-mock after resetModules
        jest.mock("firebase/app", () => ({
            initializeApp: mockInitializeApp,
            getApps: mockGetApps,
        }));
        jest.mock("firebase/auth", () => ({
            getAuth: mockGetAuth,
        }));
        firebaseModule = await import("@/lib/firebase");
    });

    it("calls initializeApp with all NEXT_PUBLIC_ env vars", () => {
        expect(mockInitializeApp).toHaveBeenCalledWith(
            expect.objectContaining({
                apiKey: "test-api-key",
                authDomain: "test-project.firebaseapp.com",
                projectId: "test-project",
                storageBucket: "test-project.appspot.com",
                messagingSenderId: "123456789",
                appId: "1:123456789:web:abcdef",
            })
        );
    });

    it("exports auth from getAuth()", () => {
        expect(mockGetAuth).toHaveBeenCalled();
        expect(firebaseModule.auth).toBeDefined();
        expect(firebaseModule.auth).toEqual({ currentUser: null });
    });

    it("does NOT re-initialize when an app already exists", async () => {
        // Simulate getApps returning an existing app
        mockGetApps.mockReturnValueOnce([{ name: "[DEFAULT]" }]);
        jest.resetModules();
        jest.mock("firebase/app", () => ({
            initializeApp: mockInitializeApp,
            getApps: mockGetApps,
        }));
        jest.mock("firebase/auth", () => ({
            getAuth: mockGetAuth,
        }));
        const callsBefore = mockInitializeApp.mock.calls.length;
        await import("@/lib/firebase");
        // initializeApp should NOT have been called again
        expect(mockInitializeApp.mock.calls.length).toBe(callsBefore);
    });
});
