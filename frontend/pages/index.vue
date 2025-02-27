<template>
  <v-container class="veiculos-container" fluid>
    <v-row align="start" justify="center">
      <v-col cols="12" md="10">
        <v-card class="elevation-12 pa-4">
          <v-toolbar flat color="#FFD700">
            <v-toolbar-title>Veículos</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="filtro"
                  label="Buscar veículos"
                  prepend-icon="mdi-magnify"
                  outlined
                  dense
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <v-btn
                  color="#1976D2"
                  dark
                  @click="abrirModalAdicionar"
                  class="mt-2 mt-md-0"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Adicionar Veículo
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="veiculosFiltrados"
              :loading="loading"
              :sort-by="ordenacao.campo"
              :sort-desc="!ordenacao.asc"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="grey" icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="acaoVeiculo('detalhes', item)">
                      <v-list-item-title>Detalhes</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="acaoVeiculo('editar', item)">
                      <v-list-item-title>Editar</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="acaoVeiculo('deletar', item)">
                      <v-list-item-title>Deletar</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      filtro: "",
      ordenacao: { campo: "placa", asc: true },
      loading: false,
      headers: [
        { text: "Placa", value: "placa", sortable: true },
        { text: "Ano", value: "ano", sortable: true },
        { text: "Cor", value: "cor", sortable: true },
        { text: "Ações", value: "actions", sortable: false },
      ],
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
        return this.ordenacao.asc
          ? valorA > valorB
            ? 1
            : -1
          : valorA < valorB
          ? 1
          : -1;
      });
    },
  },
  async fetch() {
    if (!this.$store.state.token && localStorage.getItem("token")) {
      this.$store.commit("setToken", localStorage.getItem("token"));
    }
    if (!this.$store.state.user) {
      if (process.client) {
        this.$router.push("/login");
      }
      return;
    }
    this.loading = true;
    try {
      await this.$store.dispatch("fetchVeiculos");
    } catch (error) {
      this.$vuetify.notify({
        text: "Erro ao carregar veículos",
        type: "error",
        timeout: 3000,
      });
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ordenar(campo) {
      if (this.ordenacao.campo === campo) {
        this.ordenacao.asc = !this.ordenacao.asc;
      } else {
        this.ordenacao = { campo, asc: true };
      }
    },
    acaoVeiculo(acao, veiculo) {
      switch (acao) {
        case "detalhes":
          this.$vuetify.notify({
            text: `Detalhes do veículo ${veiculo.placa}`,
            type: "info",
            timeout: 3000,
          });
          break;
        case "editar":
          this.$vuetify.notify({
            text: `Editar veículo ${veiculo.placa}`,
            type: "info",
            timeout: 3000,
          });
          break;
        case "deletar":
          this.$vuetify.notify({
            text: `Deletar veículo ${veiculo.placa}`,
            type: "warning",
            timeout: 3000,
          });
          break;
      }
    },
    abrirModalAdicionar() {
      this.$vuetify.notify({
        text: "Modal de adicionar veículo ainda não implementado",
        type: "info",
        timeout: 3000,
      });
    },
  },
};
</script>

<style scoped>
.veiculos-container {
  padding: 20px;
}
.v-card {
  border-radius: 8px;
}
.v-data-table {
  background: white;
}
.v-toolbar-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976D2;
}
</style>