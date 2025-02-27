module.exports = {
  ssr: true,
  head: {
    title: "Teste Interno",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  modules: ["@nuxtjs/axios", "@nuxtjs/vuetify"],
  axios: {
    baseURL: "http://localhost:4000", // Backend na porta 4000
  },
  vuetify: {
    treeShake: true,
    icons: {
      iconfont: "mdi", // Usa Material Design Icons
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: "#1976D2",
          secondary: "#424242",
          accent: "#FFD700",
        },
      },
    },
  },
  css: [],
  plugins: [],
  server: {
    port: 3000,
  },
};
