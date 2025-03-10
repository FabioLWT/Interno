<template>
  <v-app>
    <!-- Barra de navegação superior -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Rota Locadora</v-toolbar-title>
      <v-btn v-if="isAuthenticated && isMainRoute" text to="/" class="ml-4">
        <v-icon left>mdi-car</v-icon>
        Veículos
      </v-btn>
      <v-btn v-if="isAuthenticated && isMainRoute" text to="/historico" class="ml-2">
        <v-icon left>mdi-history</v-icon>
        Histórico de Atividades
      </v-btn>
      <v-spacer />
      <v-menu v-if="isAuthenticated" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            {{ user?.nome || 'Usuário' }}
            <v-icon right>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    isAuthenticated() {
      return !!this.$store.state.auth.user; // Verifica se o usuário está logado
    },
    isMainRoute() {
      // Mostra os botões apenas nas rotas principais (index e historico)
      const currentRoute = this.$route.path;
      return currentRoute === '/' || currentRoute === '/historico';
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
  mounted() {
    this.$store.dispatch('auth/fetchUser'); // Carrega o usuário ao montar o layout
  }
};
</script>