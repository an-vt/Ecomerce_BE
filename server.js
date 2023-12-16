const app = require("./src/app");
const {
  app: { port },
} = require("./src/configs/config");

const PORT = port || 3055;

const server = app.listen(PORT, () => {
  console.log(`Start eCommerce start with port:: ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit Server Express");
  });
});
