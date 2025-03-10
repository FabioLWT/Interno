<template>
    <v-app>
      <v-app-bar app color="primary" dark>
        <v-toolbar-title>Rota Locadora</v-toolbar-title>
      </v-app-bar>
      <v-main>
        <nuxt />
      </v-main>
    </v-app>
  </template>
  
  <script>
  export default {
    mounted() {
      if (this.$store.state.auth.user) {
        this.$router.push('/');
      }
    }
  };
  </script>