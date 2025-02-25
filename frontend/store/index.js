export const state = () => ({
  user: null, // Dados do usuário logado
  token: null, // Token JWT
  veiculos: [], // Lista de veículos
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
      localStorage.setItem("token", response.data.token); // Persiste o token
      return response.data; // Retorna para redirecionamento
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
