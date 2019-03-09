export const state = () => ({
  isLoggedIn: false
})

export const mutations = {
  LOGIN(state) {
    state.isLoggedIn = true
  },
  LOGOUT(state) {
    state.isLoggedIn = false
  }
}

export const actions = {
  async login({ commit }, payload) {
    const res = await this.$axios.$post('/login', payload)
    commit('LOGIN')
    return res
  },
  async logout({ commit }) {
    await this.$axios.$post('/logout')
    commit('LOGOUT')
  }
}
