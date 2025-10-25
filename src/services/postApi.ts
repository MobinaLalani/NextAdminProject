// src/services/post/postApi.ts
import axios from "axios";
import { API_URLS } from "@/constants/apiUrls";
import { Post, Comment, CreatePostPayload } from "./type";

export const postApi = {
  getPosts: async (): Promise<Post[]> => {
    const res = await axios.get<Post[]>(API_URLS.posts.list);
    return res.data;
  },

  getPostById: async (id: number): Promise<Post> => {
    const res = await axios.get<Post>(API_URLS.posts.detail(id));
    return res.data;
  },

  getPostComments: async (id: number): Promise<Comment[]> => {
    const res = await axios.get<Comment[]>(API_URLS.posts.comments(id));
    return res.data;
  },

  getCommentsByPostId: async (postId: number): Promise<Comment[]> => {
    const res = await axios.get<Comment[]>(
      API_URLS.comments.listByPost(postId)
    );
    return res.data;
  },

  createPost: async (payload: CreatePostPayload): Promise<Post> => {
    const res = await axios.post<Post>(API_URLS.posts.create, payload);
    return res.data;
  },

  updatePost: async (
    id: number,
    payload: Partial<CreatePostPayload>
  ): Promise<Post> => {
    const res = await axios.put<Post>(API_URLS.posts.update(id), payload);
    return res.data;
  },

  patchPost: async (
    id: number,
    payload: Partial<CreatePostPayload>
  ): Promise<Post> => {
    const res = await axios.patch<Post>(API_URLS.posts.patch(id), payload);
    return res.data;
  },

  deletePost: async (id: number): Promise<void> => {
    await axios.delete(API_URLS.posts.delete(id));
  },
};
