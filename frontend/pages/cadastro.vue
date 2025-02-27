<template>
  <v-container class="cadastro-container" fluid fill-height>
    <v-row align="center" justify="center" class="Alinhar">
      <v-col cols="12" sm="6" md="4">
        <v-card class="cadastro-card elevation-12" outlined>
          <v-toolbar color="white" flat>
            <div class="toolbar-content text-center">
              <v-icon color="#1976D2" size="40">mdi-account-plus</v-icon>
              <v-toolbar-title>Cadastro</v-toolbar-title>
            </div>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" @submit.prevent="register">
              <v-text-field
                v-model="nome"
                label="Nome"
                prepend-icon="mdi-account"
                outlined
                dense
                :rules="nameRules"
                required
              ></v-text-field>
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
              <v-text-field
                v-model="confirmarSenha"
                label="Confirmar Senha"
                prepend-icon="mdi-lock-check"
                type="password"
                outlined
                dense
                :rules="confirmPasswordRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="dataNascimento"
                label="Data de Nascimento"
                prepend-icon="mdi-calendar"
                type="date"
                outlined
                dense
                required
              ></v-text-field>
              <v-btn
                type="submit"
                color="#1976D2"
                block
                large
                class="mt-4"
                :loading="loading"
              >Cadastrar</v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center pa-4">
            <nuxt-link to="/login" class="text-decoration-none text-body-1">Já tem conta? Login</nuxt-link>
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
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      dataNascimento: "",
      loading: false,
      nameRules: [v => !!v || "Nome é obrigatório"],
      emailRules: [
        v => !!v || "Email é obrigatório",
        v => /.+@.+\..+/.test(v) || "Email inválido",
      ],
      passwordRules: [
        v => !!v || "Senha é obrigatória",
        v => (v && v.length >= 6) || "Senha deve ter no mínimo 6 caracteres",
      ],
      confirmPasswordRules: [
        v => !!v || "Confirmação de senha é obrigatória",
        v => v === this.senha || "As senhas não coincidem",
      ],
    };
  },
  methods: {
    async register() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        try {
          await this.$axios.post("/auth/register", {
            nome: this.nome,
            email: this.email,
            senha: this.senha,
            data_nascimento: this.dataNascimento,
          });
          this.$router.push("/login");
        } catch (error) {
          this.$vuetify.notify({
            text: error.response ? error.response.data.error : "Erro ao cadastrar",
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
.cadastro-container {
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
.cadastro-card {
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