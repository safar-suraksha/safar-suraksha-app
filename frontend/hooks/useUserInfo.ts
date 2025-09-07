import { useUser } from '@/contexts/UserContext';

/**
 * Custom hook to get user information with convenient access patterns
 */
export const useUserInfo = () => {
    const { user, updateUser, setUserOnboarded, clearUser, isLoading } = useUser();

    return {
        // User data
        name: user.name,
        email: user.email,
        location: user.location,
        hasUserContext: user.hasUserContext,
        isOnboarded: user.hasUserContext,

        // Full user object
        user,

        // State
        isLoading,

        // Actions
        updateUser,
        setUserOnboarded,
        clearUser,

        // Convenience methods
        updateName: (name: string) => updateUser({ name }),
        updateEmail: (email: string) => updateUser({ email }),
        updateLocation: (location: string) => updateUser({ location }),
    };
};
