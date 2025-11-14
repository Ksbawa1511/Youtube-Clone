import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userInput: [],
  sidebarOpen: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.setItem("user", null);
    },
    setAllVideos: (state, action) => {
      state.userInput = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { login, logout, setAllVideos, toggleSidebar, setSidebarOpen } = userSlice.actions;

export default userSlice.reducer;
