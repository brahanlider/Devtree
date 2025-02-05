import { Router } from "express";

const router = Router();

// Routing
router.get("/", (req, res) => {
  res.send("Hello ts");
});



export default router;
