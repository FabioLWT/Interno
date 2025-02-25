<template>
    <div class="login">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="senha" type="password" placeholder="Senha" required />
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem conta? <nuxt-link to="/cadastro">Cadastrar</nuxt-link></p>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'empty', // Sem header
    data() {
      return {
        email: '',
        senha: '',
      };
    },
    methods: {
      async login() {
        try {
          await this.$store.dispatch('login', { email: this.email, senha: this.senha });
          this.$router.push('/');
        } catch (error) {
          alert(error.message);
        }
      },
    },
  };
  </script>
  
  <style>
  .login {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    text-align: center;
  }
  input {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 8px;
  }
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
  }
  </style>