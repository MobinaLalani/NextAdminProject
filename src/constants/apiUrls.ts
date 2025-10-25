// src/services/urls.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://jsonplaceholder.typicode.com";

export const API_URLS = {
  posts: {
    list: `${BASE_URL}/posts`, // GET /posts
    detail: (id: number | string) => `${BASE_URL}/posts/${id}`, // GET /posts/1
    comments: (id: number | string) => `${BASE_URL}/posts/${id}/comments`, // GET /posts/1/comments
    create: `${BASE_URL}/posts`, // POST /posts
    update: (id: number | string) => `${BASE_URL}/posts/${id}`, // PUT /posts/1
    patch: (id: number | string) => `${BASE_URL}/posts/${id}`, // PATCH /posts/1
    delete: (id: number | string) => `${BASE_URL}/posts/${id}`, // DELETE /posts/1
  },

  comments: {
    listByPost: (postId: number | string) =>
      `${BASE_URL}/comments?postId=${postId}`, // GET /comments?postId=1
  },

  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
  },
};
