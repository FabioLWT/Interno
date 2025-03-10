import colors from "vuetify/es5/util/colors";

export default {
  // Disable server-side rendering (SPA mode)
  ssr: false,

  // Global page headers
  head: {
    titleTemplate: "%s - RotaLocadora",
    title: "Sistema",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Sistema RotaLocadora",
      },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      },
    ],
  },

  // Global CSS
  css: ["~/assets/css/main.css"],

  // Plugins to run before rendering page
  plugins: ["~/plugins/toast.js"],

  // Auto import components
  components: true,

  // Modules for dev and build
  buildModules: ["@nuxtjs/vuetify"],

  // Modules
  modules: ["@nuxtjs/axios"],

  // Configuração do Axios
  axios: {
    baseURL: "http://localhost:4000",
    credentials: false,
  },

  // Vuetify module configuration
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: "#1976D2",
          secondary: "#424242",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
        },
      },
    },
  },

  // Build Configuration
  build: {},
};
