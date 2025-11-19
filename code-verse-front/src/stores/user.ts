import { defineStore } from 'pinia'
import api from '@/lib/api/config';

export type User = {
  id: number,
  email: string,
  role: string,
  gitUser?: {
    gitName: string,
  },
}

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    user: null as any,
  }),

  getters: {
    // Get the current user
    getUser: (state) => {
      return state.user
    },

    // Get the login status
    getLoginStatus: (state) => {
      return state.isLoggedIn
    },
  },

  actions: {
    // Set the login status
    setLoginStatus(status: boolean) {
      // console.log('setLoginStatus', status)
      this.isLoggedIn = status
    },

    // Set the user data
    async setUser() {
      await api.get('/api/v1/production/users').then((response) => {
        // console.log('setUser', response.data.data)
        this.user = response.data.data
        this.isLoggedIn = true
      }).catch((error) => {
        console.error('Error fetching user data:', error)
        this.isLoggedIn = false
      }
      )
    },

    // logout
    async logout() {
      // const response = await api.post('/auth/logout');
      // if (response.status === 200) {
      this.isLoggedIn = false;
      this.user = null;
      // }
      
    },

  },
})
