import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  highestPricedProject: null,
  dailySuggestions: [],
  lowestPricedProjects: [],
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setAllProjects: (state, action) => {
      state.projects = action.payload;
    },
    setHighestPricedProject: (state, action) => {
      state.highestPricedProject = action.payload;
    },
    setDailySuggestions: (state, action) => {
      state.dailySuggestions = action.payload;
    },
    setLowestPricedProjects: (state, action) => {
      state.lowestPricedProjects = action.payload;
    },
  },
});

export const { setAllProjects, setHighestPricedProject, setDailySuggestions, setLowestPricedProjects } = projectSlice.actions;

export default projectSlice.reducer;