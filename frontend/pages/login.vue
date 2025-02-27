<template>
  <div class="background-wrapper">
    <v-container class="login-container" fluid fill-height>
      <v-row align="center" justify="center" class="Alinhar">
        <v-col cols="12" sm="6" md="4">
          <v-card class="login-card elevation-12" outlined>
            <v-toolbar color="white" flat>
              <div class="toolbar-content text-center">
                <v-icon color="#1976D2" size="40">mdi-car</v-icon>
                <v-toolbar-title>Login</v-toolbar-title>
              </div>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" @submit.prevent="login">
                <v-text-field
                  v-model="email"
                  label="Email"
                  prepend-icon="mdi-email"
                  type="email"
                  outlined
                  dense
                  :rules="emailRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="senha"
                  label="Senha"
                  prepend-icon="mdi-lock"
                  type="password"
                  outlined
                  dense
                  :rules="passwordRules"
                  required
                ></v-text-field>
                <v-btn
                  type="submit"
                  color="#1976D2"
                  block
                  large
                  class="mt-4"
                  :loading="loading"
                >Entrar</v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-center pa-4">
              <nuxt-link to="/cadastro" class="text-decoration-none text-body-1">Criar conta</nuxt-link>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: "empty",
  data() {
    return {
      email: "",
      senha: "",
      loading: false,
      emailRules: [
        v => !!v || "Email é obrigatório",
        v => /.+@.+\..+/.test(v) || "Email inválido",
      ],
      passwordRules: [
        v => !!v || "Senha é obrigatória",
        v => (v && v.length >= 6) || "Senha deve ter no mínimo 6 caracteres",
      ],
    };
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        try {
          await this.$store.dispatch("login", { email: this.email, senha: this.senha });
          this.$router.push("/");
        } catch (error) {
          this.$vuetify.notify({
            text: error.message || "Erro ao fazer login",
            type: "error",
            timeout: 3000,
          });
        } finally {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.background-wrapper {
  background-image: url("/img/FotoCarros.jpg"); /* Caminho correto para static/img/ */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  position: fixed; /* Fixa o fundo na tela */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1; /* Coloca o fundo atrás de tudo */
}
.login-container {
  background-color: transparent; /* Fundo transparente para exibir o wrapper */
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  background-color: #ffffff; /* Fundo branco do card */
  border: 2px solid #ffffff !important; /* Borda branca */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative; /* Garante que o card fique acima do fundo */
  z-index: 1; /* Prioridade sobre o fundo */
}
.Alinhar {
  display: flex;
  justify-content: center;
}
.v-card-text {
  padding: 24px;
}
.v-toolbar-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976D2;
}
.v-btn {
  text-transform: none;
}
.toolbar-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.v-icon {
  margin-bottom: 8px;
}
</style>