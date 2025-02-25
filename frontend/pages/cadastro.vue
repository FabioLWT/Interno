<template>
    <div class="cadastro">
      <h1>Cadastro</h1>
      <form @submit.prevent="register">
        <input v-model="nome" type="text" placeholder="Nome" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="senha" type="password" placeholder="Senha" required />
        <input v-model="confirmarSenha" type="password" placeholder="Confirmar Senha" required />
        <input v-model="dataNascimento" type="date" required />
        <button type="submit">Cadastrar</button>
      </form>
      <p>Já tem conta? <nuxt-link to="/login">Login</nuxt-link></p>
    </div>
  </template>
  
  <script>
  export default {
    layout: 'empty', // Sem header
    data() {
      return {
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        dataNascimento: '',
      };
    },
    methods: {
      async register() {
        if (this.senha !== this.confirmarSenha) {
          alert('As senhas não coincidem');
          return;
        }
        try {
          await this.$axios.post('/auth/register', {
            nome: this.nome,
            email: this.email,
            senha: this.senha,
            data_nascimento: this.dataNascimento,
          });
          this.$router.push('/login');
        } catch (error) {
          alert('Erro ao cadastrar');
        }
      },
    },
  };
  </script>
  
  <style>
  .cadastro {
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