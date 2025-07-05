import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useGetUser = () => {
  return useMutation({
    mutationKey: ["getUser"],
    mutationFn: async (accessToken: string) => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return data;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (userData: { email: string; password: string }) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/signin`,
        userData,
      );

      return data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (userData: {
      email: string;
      password: string;
      name: string;
    }) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/signup`,
        userData,
      );

      return data;
    },
  });
};

export const useConnectPartner = () => {
  return useMutation({
    mutationKey: ["connectPartner"],
    mutationFn: async (requestData: {
      partnerEmail: string;
      token: string;
    }) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/connect-partner`,
        { partnerEmail: requestData.partnerEmail },
        {
          headers: {
            Authorization: `Bearer ${requestData.token}`,
          },
        },
      );
      return data;
    },
  });
};

export const useGetMessages = () => {
  return useMutation({
    mutationKey: ["getMessages"],
    mutationFn: async (requestData: { chatroomId: string; token: string }) => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/chat/${requestData.chatroomId}`,
        {
          headers: {
            Authorization: `Bearer ${requestData.token}`,
          },
        },
      );
      return data;
    },
  });
};

export const useAddPoem = () => {
  return useMutation({
    mutationKey: ["addPoem"],
    mutationFn: async ({
      title,
      content,
      token,
    }: {
      title: string;
      content: string;
      token: string;
    }) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/poems`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
  });
};

export const useDeletePoem = () => {
  return useMutation({
    mutationKey: ["deletePoem"],
    mutationFn: async ({ id, token }: { id: string; token: string }) => {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/poems/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
  });
};
