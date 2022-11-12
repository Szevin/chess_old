/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
  language: 'en',
} as {
  theme: 'light' | 'dark',
  language: 'en' | 'hu',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleLanguage(state) {
      state.language = state.language === 'en' ? 'hu' : 'en'
      localStorage.setItem('language', state.language)
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', state.theme)
    },
  },
})

export const { toggleLanguage, toggleTheme } = settingsSlice.actions
export default settingsSlice.reducer
