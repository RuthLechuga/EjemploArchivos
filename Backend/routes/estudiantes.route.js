const express = require("express")
const router = express.Router()
const estudiantesController = require("../controllers/estudiantes.controller")

router.get("/", estudiantesController.getEstudiantes)
router.post("/add", estudiantesController.addEstudiante)
module.exports = router