"use client";
import React from "react";
import { Post } from "./type";
import { usePosts } from "@/hooks/usePosts"; 

function PostsPage() {
  const { data, isLoading, error } = usePosts();

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>خطا در دریافت اطلاعات</p>;

  return (
    <div className="p-4 mt-6">
      <h1 className="text-xl font-bold mb-4">لیست پست‌ها</h1>

      <div className="space-y-4 overflow-y-auto max-h-[90vh]">
        {data?.map((post: Post) => (
          <div key={post.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-gray-700 mt-2">{post.body}</p>
            <span className="text-sm text-gray-500">
              User ID: {post.userId}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostsPage;
