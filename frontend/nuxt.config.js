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
  modules: ["@nuxtjs/axios"],
  axios: {
    baseURL: "http://localhost:4000", // Aponta para o backend
  },
  css: [],
  plugins: [],
  server: {
    port: 3000,
  },
};
