import type { UserState } from "@/types";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const initialState: UserState = {
  id: undefined,
  name: undefined,
  email: undefined,
  hashedPassword: undefined,
  createAt: undefined,
  updatedAt: undefined,
  chatroom: undefined,
  chatroomId: undefined,
  message: undefined,
  onboarded: undefined,
  accessToken: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      const user = action.payload;
      state.id = user.id;
      state.name = user.name;
      state.email = user.email;
      state.hashedPassword = user.hashedPassword;
      state.createAt = user.createAt;
      state.updatedAt = user.updatedAt;
      state.chatroom = user.chatroom;
      state.chatroomId = user.chatroomId;
      state.message = user.message || [];
      state.accessToken = user.accessToken;
      state.onboarded = user.onboarded;
    },
    clearUser: (state) => {
      state.id = undefined;
      state.name = undefined;
      state.email = undefined;
      state.hashedPassword = undefined;
      state.createAt = undefined;
      state.updatedAt = undefined;
      state.chatroom = undefined;
      state.chatroomId = undefined;
      state.message = [];
      state.accessToken = undefined;
      state.onboarded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.accessToken = action.payload.access_token;
    });
    builder.addCase(loginThunk.rejected, (state) => {
      state.accessToken = undefined;
    });
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      const user = action.payload;
      state.id = user.id;
      state.name = user.name;
      state.email = user.email;
      state.hashedPassword = user.hashedPassword;
      state.createAt = user.createAt;
      state.updatedAt = user.updatedAt;
      state.chatroom = user.chatroom;
      state.chatroomId = user.chatroomId;
      state.message = user.message || [];
      state.onboarded = user.onboarded;
    });
    builder.addCase(getUserThunk.rejected, (state) => {
      state.id = undefined;
      state.name = undefined;
      state.email = undefined;
      state.hashedPassword = undefined;
      state.createAt = undefined;
      state.updatedAt = undefined;
      state.chatroom = undefined;
      state.chatroomId = undefined;
      state.message = [];
      state.accessToken = undefined;
      state.onboarded = false;
    });
    builder.addCase(registerThunk.fulfilled, (state) => {
      state.id = undefined;
      state.name = undefined;
      state.email = undefined;
      state.hashedPassword = undefined;
      state.createAt = undefined;
      state.updatedAt = undefined;
      state.chatroom = undefined;
      state.chatroomId = undefined;
      state.message = undefined;
      state.onboarded = undefined;
    });
    builder.addCase(registerThunk.rejected, (state) => {
      state.id = undefined;
      state.name = undefined;
      state.email = undefined;
      state.hashedPassword = undefined;
      state.createAt = undefined;
      state.updatedAt = undefined;
      state.chatroom = undefined;
      state.chatroomId = undefined;
      state.message = [];
      state.onboarded = undefined;
    });
    builder.addCase(connectPartnerThunk.fulfilled, () => {
      return;
    });
    builder.addCase(connectPartnerThunk.rejected, () => {
      return;
    });
  },
});

export const getUserThunk = createAsyncThunk(
  "user/getUser",
  async (accessToken: string) => {
    const { data } = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  },
);

export const loginThunk = createAsyncThunk(
  "user/login",
  async (userData: { email: string; password: string }) => {
    const { data } = await axios.post(`${BASE_URL}/auth/signin`, userData);
    getUserThunk(data.access_token);
    return data;
  },
);

export const registerThunk = createAsyncThunk(
  "user/register",
  async (userData: { email: string; password: string; name: string }) => {
    const { data } = await axios.post(`${BASE_URL}/auth/signup`, userData);
    return data;
  },
);

export const connectPartnerThunk = createAsyncThunk(
  "user/connect-partner",
  async (requestData: { partnerEmail: string; token: string }) => {
    const { data } = await axios.post(
      `${BASE_URL}/user/connect-partner`,
      { partnerEmail: requestData.partnerEmail },
      {
        headers: {
          Authorization: `Bearer ${requestData.token}`,
        },
      },
    );
    return data;
  },
);

export const getMessageThunk = createAsyncThunk(
  "user/get-messages",
  async (requestData: { chatroomId: string; token: string }) => {
    const { data } = await axios.get(
      `${BASE_URL}/chat/${requestData.chatroomId}`,
      {
        headers: {
          Authorization: `Bearer ${requestData.token}`,
        },
      },
    );

    return data;
  },
);

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
