<template>
  <div class="login-container">
    <v-container fluid class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="mx-auto pa-6" elevation="8" max-width="400" style="min-height: 400px; margin-top: 50px;">
            <div class="text-center mb-4">
              <v-icon x-large color="primary">mdi-garage</v-icon>
            </div>
            <h2 class="text-center mb-6">Login</h2>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="form.email"
                label="E-mail"
                placeholder="Digite o e-mail"
                outlined
                dense
                class="mb-4"
              />
              <v-text-field
                v-model="form.senha"
                label="Senha"
                placeholder="Digite a senha"
                type="password"
                outlined
                dense
                append-icon="mdi-eye-off"
                @click:append="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                class="mb-4"
              />
              <v-btn type="submit" color="primary" block large class="mb-4">
                Entrar
              </v-btn>
              <div class="text-center">
                <nuxt-link to="/register" class="text-decoration-none">
                  Criar conta
                </nuxt-link>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  layout: "guest",
  data: () => ({
    form: { email: "", senha: "" },
    showPassword: false,
    snackbar: {
      show: false,
      message: "",
      color: "",
    },
  }),
  methods: {
    async login() {
      try {
        await this.$store.dispatch("auth/login", this.form);
        this.snackbar = {
          show: true,
          message: "Login Realizado",
          color: "success",
        };
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);
      } catch (error) {
        this.snackbar = {
          show: true,
          message: "Erro ao Realizar Login",
          color: "error",
        };
      }
    },
  },
};
</script>

<style scoped>
/* Estilo para o container raiz com a imagem de fundo */
.login-container {
  height: 100vh; /* Ocupa toda a altura da tela */
  background-image: url('~/assets/images/background.jpg'); /* Caminho da imagem */
  background-size: cover; /* Cobre toda a tela */
  background-position: center; /* Centraliza a imagem */
  background-repeat: no-repeat; /* Não repete a imagem */
}

/* Garante que o container ocupe toda a altura da tela e centralize o conteúdo */
.v-container.fill-height {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Adiciona um estilo ao card para garantir que ele ocupe um espaço mínimo */
.v-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95); /* Fundo branco com leve transparência para legibilidade */
}
</style>