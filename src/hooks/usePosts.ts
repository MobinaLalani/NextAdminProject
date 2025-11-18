"use client";

import { useQuery } from "@tanstack/react-query";
import { postApi } from "@/services/postApi";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: postApi.getPosts,
    staleTime: 1000 * 60, 
  });
};
