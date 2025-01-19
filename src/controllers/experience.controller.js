import Experience from "../models/experience.model.js";

export const getAllExperience = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {

        const skip = (page - 1) * limit;

        const results = await Experience.find()
            .skip(skip)
            .limit(parseInt(limit));


        res.json({ results });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los resultados' });
    }
};

export const postExperience  = async (req, res) => {
    try {
        const experiences = req.body.experience; // Obtener los datos del cuerpo de la solicitud

        if (!Array.isArray(experiences) || experiences.length === 0) {
            return res.status(400).json({ message: "El array de experiencias es requerido" });
        }

        // Insertar múltiples documentos
        const savedExperiences = await Experience.insertMany(experiences);

        res.status(201).json({
            message: "Experiencias agregadas exitosamente",
            data: savedExperiences
        });
    } catch (error) {
        console.error("Error al insertar experiencias:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
} 