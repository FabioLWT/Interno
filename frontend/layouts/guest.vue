<template>
  <v-app>
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
  },
};
</script>