import express from "express"; // ESM Ecmascript modules
import router from "./router";

const app = express();

app.use("/", router);

export default app