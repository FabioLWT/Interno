<template>
  <div class="register-container">
    <v-container fluid class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="mx-auto pa-6" elevation="8" max-width="400" style="min-height: 400px; margin-top: 50px;">
            <div class="text-center mb-4">
              <v-icon x-large color="primary">mdi-garage</v-icon>
            </div>
            <h2 class="text-center mb-6">Novo Cadastro</h2>
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="form.nome"
                label="Nome de usuário"
                placeholder="Digite o nome de usuário"
                outlined
                dense
                class="mb-4"
              />
              <v-text-field
                v-model="form.data_nascimento"
                label="Data de aniversário"
                placeholder="Selecione a data de aniversário"
                type="date"
                outlined
                dense
                class="mb-4"
              />
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
              <v-text-field
                v-model="form.confirmarSenha"
                label="Confirmar Senha"
                placeholder="Confirme a senha"
                type="password"
                outlined
                dense
                append-icon="mdi-eye-off"
                @click:append="showConfirmPassword = !showConfirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="mb-4"
              />
              <v-btn type="submit" color="primary" block large class="mb-4">
                Cadastrar
              </v-btn>
              <div class="text-center">
                <nuxt-link to="/login" class="text-decoration-none">
                  Fazer login
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
  layout: 'guest',
  data: () => ({
    form: {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      data_nascimento: ''
    },
    showPassword: false,
    showConfirmPassword: false,
    snackbar: {
      show: false,
      message: '',
      color: ''
    }
  }),
  methods: {
    async register() {
      if (this.form.senha !== this.form.confirmarSenha) {
        this.snackbar = {
          show: true,
          message: 'As senhas não coincidem',
          color: 'error'
        };
        return;
      }
      try {
        await this.$axios.post('/auth/register', this.form);
        this.snackbar = {
          show: true,
          message: 'Usuário Cadastrado com Sucesso',
          color: 'success'
        };
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        this.snackbar = {
          show: true,
          message: 'Falha ao Cadastrar Usuário',
          color: 'error'
        };
      }
    }
  }
};
</script>

<style scoped>

.register-container {
  height: 100vh; 
  background-image: url('~/assets/images/background.jpg'); 
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat; 
}


.v-container.fill-height {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}


.v-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95); 
}
</style>
