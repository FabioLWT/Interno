<template>
  <v-container fluid>
    <!-- Tabela de Histórico -->
    <v-data-table
      :headers="headers"
      :items="history"
      :items-per-page="10"
      :page.sync="page"
      hide-default-footer
      class="elevation-1"
    >
      <!-- Coluna Ação com Ícone -->
      <template v-slot:item.acao="{ item }">
        <v-icon :color="getActionColor(item.acao)" small class="mr-2">
          {{ getActionIcon(item.acao) }}
        </v-icon>
        {{ item.acao }}
      </template>

      <!-- Coluna Data -->
      <template v-slot:item.data="{ item }">
        {{ formatDate(item.data) }}
      </template>
    </v-data-table>

    <!-- Paginação -->
    <v-row class="mt-4">
      <v-col>
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="7"
          color="primary"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    page: 1,
    itemsPerPage: 10,
    headers: [
      { text: '', value: 'acao', sortable: false },
      { text: 'Veículo', value: 'veiculo_id' },
      { text: 'Descrição', value: 'descricao' },
      { text: 'Data', value: 'data' }
    ],
    history: []
  }),
  computed: {
    totalPages() {
      return Math.ceil(this.history.length / this.itemsPerPage);
    }
  },
  async mounted() {
    if (!this.$store.state.auth.user) {
      this.$router.push('/login');
    } else {
      await this.fetchHistory();
    }
  },
  methods: {
    async fetchHistory() {
      const { data } = await this.$axios.get('/historico');
      this.history = data;
    },
    getActionIcon(acao) {
      if (acao.includes('CADASTRADO')) return 'mdi-plus-circle';
      if (acao.includes('EDITADO')) return 'mdi-pencil';
      if (acao.includes('DELETADO')) return 'mdi-delete';
      return 'mdi-information';
    },
    getActionColor(acao) {
      if (acao.includes('CADASTRADO')) return 'green';
      if (acao.includes('EDITADO')) return 'blue';
      if (acao.includes('DELETADO')) return 'red';
      return 'grey';
    },
    formatDate(date) {
      return new Date(date).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  }
};
</script>