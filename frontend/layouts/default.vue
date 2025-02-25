<template>
    <div>
      <header v-if="$store.state.user" class="header">
        <span>Bem-vindo, {{ $store.state.user.nome }}</span>
        <nav>
          <button @click="logout">Sair</button>
        </nav>
      </header>
      <nuxt /> <!-- Renderiza as páginas -->
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        this.$store.dispatch('logout');
        this.$router.push('/login');
      },
    },
  };
  </script>
  
  <style>
  .header {
    padding: 1rem;
    background-color: #f8f8f8;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  </style>