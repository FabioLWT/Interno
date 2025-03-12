<template>
  <v-container fluid>
    
    <v-data-table
      :headers="headers"
      :items="history"
      :items-per-page="10"
      :page.sync="page"
      hide-default-footer
      class="elevation-1"
    >
      
      <template v-slot:item.acao="{ item }">
        <v-icon :color="getActionColor(item.acao)" small class="mr-2">
          {{ getActionIcon(item.acao) }}
        </v-icon>
        {{ item.acao }}
      </template>

      
      <template v-slot:item.data="{ item }">
        {{ formatDate(item.data) }}
      </template>
    </v-data-table>

    
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
import moment from 'moment';
import 'moment/locale/pt-br';

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
      try {
        const { data } = await this.$axios.get('/historico');
        this.history = data;
        console.log("Histórico carregado:", this.history); 
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        this.$toast.error("Erro ao carregar histórico: " + (error.response?.data?.error || error.message));
      }
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
      if (!date) return 'N/A'; 
      moment.locale('pt-br');
      const formattedDate = moment(date).format('DD/MM/YYYY [às] HH:mm');
      return formattedDate === 'Invalid date' ? 'Data Inválida' : formattedDate;
    }
  }
};
</script>