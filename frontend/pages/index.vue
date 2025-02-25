<template>
  <div class="veiculos">
    <h1>Veículos</h1>
    <div class="controls">
      <input v-model="filtro" placeholder="Buscar veículos" />
      <button @click="abrirModalAdicionar">Adicionar Veículo</button>
    </div>
    <table>
      <thead>
        <tr>
          <th @click="ordenar('placa')">Placa</th>
          <th @click="ordenar('ano')">Ano</th>
          <th @click="ordenar('cor')">Cor</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="veiculo in veiculosFiltrados" :key="veiculo.id">
          <td>{{ veiculo.placa }}</td>
          <td>{{ veiculo.ano }}</td>
          <td>{{ veiculo.cor }}</td>
          <td>
            <select @change="acaoVeiculo($event, veiculo)">
              <option value="">Opções</option>
              <option value="detalhes">Detalhes</option>
              <option value="editar">Editar</option>
              <option value="deletar">Deletar</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filtro: '',
      ordenacao: { campo: 'placa', asc: true },
    };
  },
  computed: {
    veiculosFiltrados() {
      let lista = [...this.$store.state.veiculos];
      if (this.filtro) {
        lista = lista.filter((v) =>
          v.placa.toLowerCase().includes(this.filtro.toLowerCase())
        );
      }
      return lista.sort((a, b) => {
        const valorA = a[this.ordenacao.campo];
        const valorB = b[this.ordenacao.campo];
        return this.ordenacao.asc ? (valorA > valorB ? 1 : -1) : (valorA < valorB ? 1 : -1);
      });
    },
  },
  async fetch() {
    // Só acessa localStorage no cliente
    if (process.client && !this.$store.state.token && localStorage.getItem('token')) {
      this.$store.commit('setToken', localStorage.getItem('token'));
    }
    // Verifica autenticação
    if (!this.$store.state.user) {
      if (process.client) {
        this.$router.push('/login'); // Redireciona apenas no cliente
      }
      return;
    }
    await this.$store.dispatch('fetchVeiculos');
  },
  methods: {
    ordenar(campo) {
      if (this.ordenacao.campo === campo) {
        this.ordenacao.asc = !this.ordenacao.asc;
      } else {
        this.ordenacao = { campo, asc: true };
      }
    },
    acaoVeiculo(event, veiculo) {
      const acao = event.target.value;
      if (acao === 'detalhes') {
        alert('Detalhes: ' + JSON.stringify(veiculo));
      } else if (acao === 'editar') {
        alert('Editar: ' + veiculo.placa);
      } else if (acao === 'deletar') {
        alert('Deletar: ' + veiculo.placa);
      }
      event.target.value = '';
    },
    abrirModalAdicionar() {
      alert('Modal de adicionar veículo ainda não implementado');
    },
  },
};
</script>

<style>
.veiculos {
  padding: 20px;
}
.controls {
  margin-bottom: 20px;
}
input {
  padding: 8px;
  margin-right: 10px;
}
button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  cursor: pointer;
  background-color: #f2f2f2;
}
</style>