import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    loading: false,
    blog: [], // make sure it's an array
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBlog: (state, action) => {
      state.blog = action.payload; // ✅ correct property
    },
  },
});

export const { setLoading, setBlog } = blogSlice.actions;
export default blogSlice.reducer;
