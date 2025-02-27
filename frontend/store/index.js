export const state = () => ({
  user: null,
  token: null,
  veiculos: [],
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setToken(state, token) {
    state.token = token;
  },
  setVeiculos(state, veiculos) {
    state.veiculos = veiculos;
  },
  logout(state) {
    state.user = null;
    state.token = null;
  },
};

export const actions = {
  async login({ commit }, { email, senha }) {
    try {
      const response = await this.$axios.post("/auth/login", { email, senha });
      commit("setUser", {
        id: response.data.id,
        nome: response.data.nome,
        email: response.data.email,
      });
      commit("setToken", response.data.token);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw new Error("Credenciais inválidas");
    }
  },
  async fetchVeiculos({ commit, state }) {
    try {
      const response = await this.$axios.get("/veiculos", {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      commit("setVeiculos", response.data);
    } catch (error) {
      throw new Error("Erro ao carregar veículos");
    }
  },
  logout({ commit }) {
    commit("logout");
    localStorage.removeItem("token");
  },
};
