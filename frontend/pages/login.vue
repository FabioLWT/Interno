<template>
  <v-container class="login-container" fluid fill-height>
    <v-row align="center" justify="center" class="Alinhar">
      <v-col cols="12" sm="6" md="4">
        <v-card class="login-card elevation-12" outlined>
          <v-toolbar color="white" flat>
            <div class="toolbar-content text-center">
              <v-icon color="#1976D2" size="40">mdi-car</v-icon>
              <v-toolbar-title class="text-center">Login</v-toolbar-title>
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
.login-container {
  background-color: #ffffff; /* Fundo branco */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  border: 2px solid #ffffff !important; /* Borda branca */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  flex-direction: column; /* Empilha ícone e texto verticalmente */
  align-items: center; /* Centraliza horizontalmente */
  justify-content: center; /* Centraliza verticalmente */
  width: 100%;
}
.v-icon {
  margin-bottom: 8px; /* Espaço entre o ícone e o texto */
}
</style>