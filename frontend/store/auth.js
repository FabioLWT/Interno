export const state = () => ({
  user: null,
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
};

export const actions = {
  async login({ commit }, { email, senha }) {
    const { data } = await this.$axios.post("/auth/login", { email, senha });
    commit("setUser", data);
    localStorage.setItem("token", data.token);
    this.$axios.setToken(data.token, "Bearer");
  },
  logout({ commit }) {
    commit("setUser", null);
    localStorage.removeItem("token");
    this.$axios.setToken(false);
  },
  async fetchUser({ commit }) {
    const token = localStorage.getItem("token");
    if (token) {
      this.$axios.setToken(token, "Bearer");
      try {
        const { data } = await this.$axios.get("/auth/me"); // Adicione este endpoint no backend
        commit("setUser", data);
      } catch (e) {
        commit("setUser", null);
      }
    }
  },
};
