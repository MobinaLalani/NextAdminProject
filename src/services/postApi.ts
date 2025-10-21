import axios from "axios";
import { API_URLS } from "@/constants/apiUrls";

export const postApi = {
  getPosts: async () => {
    const res = await axios.get(API_URLS.posts);
    return res.data;
  },
};
