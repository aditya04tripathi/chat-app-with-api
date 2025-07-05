import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetPoemById = (id: string) => {
  return useQuery({
    queryKey: ["getPoemById", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/poems/${id}`,
      );
      return data;
    },
  });
};

export const useGetPoems = () => {
  return useQuery({
    queryKey: ["getPoems"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/poems`,
      );
      return data;
    },
  });
};
