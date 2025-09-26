import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const requireAuth = () => {
        if (status === "loading") return false;
        if (!session) {
            router.push("/auth/signin");
            return false;
        }
        return true;
    };

    const isAuthenticated = !!session;
    const isLoading = status === "loading";

    return {
        session,
        isAuthenticated,
        isLoading,
        requireAuth,
    };
};
