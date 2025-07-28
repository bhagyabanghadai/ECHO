import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries();
    }
  });
}