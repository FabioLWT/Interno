<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col cols="12" sm="4">
        <v-select
          v-model="filters.marca"
          :items="marcas"
          label="Marca"
          placeholder="Selecione a marca do veículo"
          outlined
          dense
          clearable
          item-value="id"
          item-text="nome"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          v-model="filters.finalidade"
          :items="finalidades"
          label="Propósito de uso"
          placeholder="Selecione o propósito de uso"
          outlined
          dense
          clearable
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="filters.placa"
          label="Placa"
          placeholder="Digite a placa ou cor do veículo"
          outlined
          dense
          clearable
          append-icon="mdi-magnify"
        />
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col>
        <v-btn color="primary" @click="openAddModal">
          <v-icon left>mdi-plus</v-icon>
          Cadastrar Veículo
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredVehicles"
      :items-per-page="10"
      :page.sync="page"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:item.nivel_conforto="{ item }">
        <v-rating
          :value="item.nivel_conforto"
          color="amber"
          dense
          half-increments
          readonly
          size="20"
        />
      </template>

      <template v-slot:item.local_descanso="{ item }">
        {{ formatCoordinates(item.latitude, item.longitude) }}
      </template>

      <template v-slot:item.zero_quilometro="{ item }">
        {{ formatZeroQuilometro(item.zero_quilometro) }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="openDetailsModal(item)">
              <v-list-item-title>Detalhes</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openEditModal(item)">
              <v-list-item-title>Editar</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openDeleteModal(item)">
              <v-list-item-title>Deletar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>{{
          editMode ? "Editar Veículo" : "Adicionar Veículo"
        }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveVehicle" ref="form" v-model="formValid">
            <v-text-field
              v-model="form.placa"
              label="Placa"
              outlined
              dense
              :rules="[(v) => !!v || 'Placa é obrigatória']"
            />
            <v-select
              v-model="form.marca_id"
              :items="marcas"
              label="Marca"
              placeholder="Selecione a marca"
              outlined
              dense
              :rules="[(v) => !!v || 'Marca é obrigatória']"
              item-value="id"
              item-text="nome"
            />
            <v-text-field
              v-model="form.modelo"
              label="Modelo"
              outlined
              dense
              :rules="[(v) => !!v || 'Modelo é obrigatório']"
            />
            <v-text-field
              v-model="form.ano"
              label="Ano"
              type="number"
              outlined
              dense
              :rules="[
                (v) =>
                  (!!v && v >= 1900 && v <= new Date().getFullYear() + 1) ||
                  'Ano inválido',
              ]"
            />
            <v-text-field
              v-model="form.cor"
              label="Cor"
              outlined
              dense
              :rules="[(v) => !!v || 'Cor é obrigatória']"
            />
            <v-select
              v-model="form.finalidade"
              :items="finalidades"
              label="Propósito de uso"
              outlined
              dense
              :rules="[(v) => !!v || 'Propósito de uso é obrigatório']"
            />
            <v-select
              v-model="form.zero_quilometro"
              :items="['Sim', 'Não']"
              label="Zero-quilômetro?"
              outlined
              dense
              :rules="[(v) => !!v || 'Zero-quilômetro é obrigatório']"
            />
            <v-text-field
              v-model.number="form.nivel_conforto"
              label="Nível de Conforto (1-5)"
              type="number"
              min="1"
              max="5"
              outlined
              dense
              :rules="[
                (v) =>
                  (!!v && v >= 1 && v <= 5) ||
                  'Nível de conforto deve ser entre 1 e 5',
              ]"
            />
            <v-text-field
              v-model.number="form.local_descanso_x"
              label="Latitude"
              outlined
              dense
              :rules="[(v) => (!!v && !isNaN(v)) || 'Latitude inválida']"
            />
            <v-text-field
              v-model.number="form.local_descanso_y"
              label="Longitude"
              outlined
              dense
              :rules="[(v) => (!!v && !isNaN(v)) || 'Longitude inválida']"
            />
            <v-btn
              type="submit"
              color="primary"
              class="mr-2"
              :disabled="!formValid"
              >Salvar</v-btn
            >
            <v-btn text @click="dialog = false">Cancelar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="detailsDialog" max-width="800px" @after-enter="initMap">
      <v-card>
        <v-card-title>Detalhes do Veículo</v-card-title>
        <v-card-text>
          <p>Placa: {{ selectedVehicle?.placa || "N/A" }}</p>
          <p>Marca: {{ selectedVehicle?.marca || "Marca Desconhecida" }}</p>
          <p>Modelo: {{ selectedVehicle?.modelo || "Modelo Desconhecido" }}</p>
          <p>Ano: {{ selectedVehicle?.ano || "N/A" }}</p>
          <p>Cor: {{ selectedVehicle?.cor || "N/A" }}</p>
          <p>Propósito de uso: {{ selectedVehicle?.finalidade || "N/A" }}</p>
          <p>
            Zero-quilômetro?:
            {{
              formatZeroQuilometro(selectedVehicle?.zero_quilometro) || "N/A"
            }}
          </p>
          <p>
            Nível de Conforto: {{ selectedVehicle?.nivel_conforto || "N/A" }}
          </p>
          <p>
            Local de Repouso:
            {{
              formatCoordinates(
                selectedVehicle?.latitude,
                selectedVehicle?.longitude
              )
            }}
          </p>
          <l-map
            ref="map"
            :zoom="13"
            :center="[
              selectedVehicle?.latitude || 0,
              selectedVehicle?.longitude || 0,
            ]"
            style="height: 300px; width: 100%"
            v-if="detailsDialog"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              :attribution="`© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors`"
            ></l-tile-layer>
            <l-marker
              :lat-lng="[
                selectedVehicle?.latitude || 0,
                selectedVehicle?.longitude || 0,
              ]"
            ></l-marker>
          </l-map>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="detailsDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Deseja Excluir Esse Carro?</v-card-title>
        <v-card-text>
          <p>Essa ação não pode ser desfeita.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="confirmDelete">Sim</v-btn>
          <v-btn text @click="deleteDialog = false">Não</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { LMap, LMarker, LTileLayer } from "vue2-leaflet";
import { mapState } from "vuex";

export default {
  components: { LMap, LTileLayer, LMarker },
  data: () => ({
    page: 1,
    itemsPerPage: 10,
    filters: {
      marca: "",
      finalidade: "",
      placa: "",
    },
    dialog: false,
    detailsDialog: false,
    editMode: false,
    formValid: true,
    selectedVehicle: null,
    isFetching: false,
    deleteDialog: false, 
    vehicleToDelete: null, 
    form: {
      id: null,
      placa: "",
      marca_id: null,
      modelo: "",
      modelo_id: null,
      ano: "",
      cor: "",
      finalidade: "",
      zero_quilometro: "",
      nivel_conforto: "",
      local_descanso_x: "",
      local_descanso_y: "",
    },
    headers: [
      { text: "Placa", value: "placa" },
      { text: "Marca/Modelo", value: "marca_modelo" },
      { text: "Ano", value: "ano" },
      { text: "Cor", value: "cor" },
      { text: "Propósito de uso", value: "finalidade" },
      { text: "Zero-quilômetro?", value: "zero_quilometro" },
      { text: "Nível de conforto", value: "nivel_conforto" },
      { text: "Local de repouso (lat, long)", value: "local_descanso" },
      { text: "", value: "actions", sortable: false },
    ],
    finalidades: ["Uso pessoal", "Veículo para locação", "Uso da empresa"],
    marcas: [
      { id: 68, nome: "BMW" },
      { id: 69, nome: "Chevrolet" },
      { id: 70, nome: "Peugeot" },
      { id: 71, nome: "Audi" },
      { id: 72, nome: "Jeep" },
      { id: 2, nome: "Ford" },
      { id: 74, nome: "Fiat" },
      { id: 1, nome: "Toyota" },
      { id: 76, nome: "Renault" },
      { id: 77, nome: "Volkswagen" },
    ],
    vehicles: [],
  }),
  computed: {
    ...mapState(["auth"]),
    filteredVehicles() {
      let filtered = this.vehicles;
      console.log("Aplicando filtros:", this.filters);
      if (this.filters.marca) {
        filtered = filtered.filter((v) => {
          console.log(
            `Filtrando marca: v.marca_id=${v.marca_id}, filters.marca=${this.filters.marca}`
          );
          return v.marca_id === this.filters.marca;
        });
      }
      if (this.filters.finalidade) {
        filtered = filtered.filter(
          (v) => v.finalidade === this.filters.finalidade
        );
      }
      if (this.filters.placa) {
        filtered = filtered.filter(
          (v) =>
            v.placa.toLowerCase().includes(this.filters.placa.toLowerCase()) ||
            v.cor.toLowerCase().includes(this.filters.placa.toLowerCase())
        );
      }
      filtered = filtered.map((v) => ({
        ...v,
        marca_modelo: `${v.marca || "Marca Desconhecida"} ${
          v.modelo || "Modelo Desconhecido"
        }`,
      }));
      console.log("Veículos após filtro:", filtered);
      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredVehicles.length / this.itemsPerPage);
    },
  },
  async mounted() {
    if (!this.auth.user) {
      this.$router.push("/login");
    } else {
      await this.fetchVehicles();
      console.log("Veículos carregados ao montar:", this.vehicles);
    }
  },
  methods: {
    async fetchVehicles() {
      if (this.isFetching) return;
      this.isFetching = true;
      try {
        console.log("Buscando veículos...");
        const { data } = await this.$axios.get("/veiculos");
        this.vehicles = data.map((vehicle) => ({
          ...vehicle,
          marca_modelo: `${vehicle.marca || "Marca Desconhecida"} ${
            vehicle.modelo || "Modelo Desconhecido"
          }`,
        }));
        console.log("Veículos carregados:", this.vehicles);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        this.$toast.error(
          "Erro ao carregar veículos: " +
            (error.response?.data?.error || error.message)
        );
      } finally {
        this.isFetching = false;
      }
    },
    openAddModal() {
      this.editMode = false;
      this.form = {
        id: null,
        placa: "",
        marca_id: null,
        modelo: "",
        modelo_id: null,
        ano: "",
        cor: "",
        finalidade: "",
        zero_quilometro: "",
        nivel_conforto: "",
        local_descanso_x: "",
        local_descanso_y: "",
      };
      this.dialog = true;
    },
    openEditModal(item) {
      console.log("Abrindo modal de edição para:", item);
      this.editMode = true;
      this.form = {
        id: item.id,
        placa: item.placa || "",
        marca_id: this.marcas.find((m) => m.nome === item.marca)?.id || null,
        modelo: item.modelo || "",
        modelo_id: item.modelo_id || null,
        ano: item.ano || "",
        cor: item.cor || "",
        finalidade: item.finalidade || "",
        zero_quilometro: item.zero_quilometro ? "Sim" : "Não", 
        nivel_conforto: item.nivel_conforto || "",
        local_descanso_x: item.latitude || "",
        local_descanso_y: item.longitude || "",
      };
      this.dialog = true;
    },
    openDetailsModal(item) {
      console.log("Dados do veículo selecionado:", item);
      this.selectedVehicle = {
        ...item,
        latitude: item.longitude,
        longitude: item.latitude,
      };
      this.detailsDialog = true;
    },
    initMap() {
      this.$nextTick(() => {
        if (this.$refs.map) {
          console.log("Inicializando mapa...");
          this.$refs.map.mapObject.invalidateSize();
          console.log("Mapa inicializado com centro:", [
            this.selectedVehicle?.latitude || 0,
            this.selectedVehicle?.longitude || 0,
          ]);
        } else {
          console.error("Referência ao mapa não encontrada.");
        }
      });
    },
    async saveVehicle() {
      if (!this.formValid) {
        this.$toast.error("Por favor, corrija os campos inválidos.");
        return;
      }

      const lat = parseFloat(this.form.local_descanso_x);
      const lng = parseFloat(this.form.local_descanso_y);
      if (isNaN(lat) || isNaN(lng)) {
        this.$toast.error("Latitude e Longitude devem ser números válidos.");
        return;
      }

      const payload = {
        ...this.form,
        zero_quilometro: this.form.zero_quilometro === "Sim" ? true : false, 
        local_descanso: {
          x: lat,
          y: lng,
        },
      };
      delete payload.local_descanso_x;
      delete payload.local_descanso_y;

      try {
        if (this.editMode) {
          console.log("Atualizando veículo - Payload:", payload);
          const { data } = await this.$axios.put(
            `/veiculos/${this.form.id}`,
            payload
          );
          console.log("Resposta do PUT:", data);
          this.$toast.success("Veículo atualizado com sucesso!");
        } else {
          console.log("Cadastrando veículo - Payload:", payload);
          const { data } = await this.$axios.post("/veiculos", payload);
          console.log("Resposta do POST:", data);
          this.$toast.success("Veículo cadastrado com sucesso!");
        }
        this.dialog = false;
        await this.fetchVehicles();
        console.log("Lista de veículos atualizada:", this.vehicles);
      } catch (error) {
        console.error("Erro na requisição:", error.response || error);
        this.$toast.error(
          `Erro ao ${this.editMode ? "atualizar" : "cadastrar"} veículo: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    },
    openDeleteModal(item) {
      this.vehicleToDelete = item.id; 
      this.deleteDialog = true; 
    },
    async confirmDelete() {
      if (this.vehicleToDelete) {
        try {
          console.log("Deletando veículo com id:", this.vehicleToDelete);
          await this.$axios.delete(`/veiculos/${this.vehicleToDelete}`);
          this.$toast.success("Veículo deletado com sucesso!");
          await this.fetchVehicles();
          console.log("Lista de veículos após exclusão:", this.vehicles);
        } catch (error) {
          this.$toast.error(
            `Erro ao deletar veículo: ${
              error.response?.data?.error || error.message
            }`
          );
          console.error("Erro na exclusão:", error);
        }
      }
      this.deleteDialog = false; 
      this.vehicleToDelete = null; 
    },
    formatCoordinates(lat, lng) {
      if (lat == null || lng == null) return "N/A";
      return `${lng.toFixed(4)}, ${lat.toFixed(4)}`;
    },
    formatZeroQuilometro(value) {
      return value === true ? "Sim" : "Não";
    },
  },
};
</script>

<style scoped>
.leaflet-container {
  height: 300px;
  width: 100%;
}
</style>

