import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/apis/auth.apis";

export const useAuth = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ["user", "auth"],
        queryFn: getUser,
        retry: false,
        refetchOnWindowFocus: false,
    });
    return { dataAuth: data, isError, isLoadingAuth: isLoading };
};