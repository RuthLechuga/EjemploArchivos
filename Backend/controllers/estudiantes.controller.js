const BD = require('../config/oracleConnection');

exports.getEstudiantes = async (req, res) => {
    try{
        let query = "SELECT * FROM ESTUDIANTE";
        let result = await BD.Open(query, [], false);
        let estudiantes = [];

        estudiantes = result.rows.map(user =>{
            let estudianteSchema = {
                "carnet": user[0],
                "nombre": user[1]
            }

            return estudianteSchema
        })
        res.json(estudiantes);
    }
    catch(error)
    {
        console.log("Error al realizar la consulta => ",error)
        res.json({})
    }
}

exports.addEstudiante = async(req,res) => {
    try{
        const { carnet, nombre } = req.body
        let sql = `INSERT INTO ESTUDIANTE(carnet,nombre) VALUES (${carnet},'${nombre}')`
        await BD.Open(sql, [], true);

        res.json({"Info": "Estudiante creado exitosamente"})
    }
    catch(error){
        console.log("Error al crear el estudiante => ",error)
        res.json({})
    }
}