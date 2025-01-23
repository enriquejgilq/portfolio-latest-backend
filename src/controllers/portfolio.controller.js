import Portfolio from "../models/portfolio.model.js";
import Fuse from 'fuse.js';
export const getPortfolio = async (req, res) => {
    const { query, technology } = req.query;
    console.log('Received query:', query, 'Received technology:', technology); // Registra los parámetros

    try {
         if (!query) {
            return res.status(400).json({ message: 'Query parameter is required.' });
        }

         const conditions = {
            $or: [
                { name: { $regex: query, $options: 'i' } },         
                { description: { $regex: query, $options: 'i' } }  
            ]
        };

         if (technology) {
            const techArray = technology.split(',').map(tech => tech.trim());  
            conditions.technology = { $in: techArray };  
        }
       
        
        console.log("Search conditions:", conditions); // Registra las condiciones de búsqueda

        // Busca los proyectos que coincidan con las condiciones
        const projects = await Portfolio.find(conditions);
        console.log("Projects found:", projects); // Registra los proyectos encontrados

        // Si no hay resultados, busca coincidencias más parecidas
        if (projects.length === 0) {
            const similarConditions = {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            };

            // Busca proyectos similares
            const similarProjects = await Portfolio.find(similarConditions);
            console.log("Similar projects found:", similarProjects); // Registra proyectos similares

            return res.status(200).json({ message: 'No exact matches found. Suggestions:', similarProjects });
        }

        // Devuelve los proyectos encontrados
        res.status(200).json({ message: 'success!', projects });
    } catch (error) {
        console.error("Error fetching projects:", error); // Registra el error
        res.status(500).json({ message: 'An error occurred while fetching information' });
    }
};

export const getAllPortfolio = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {

        const skip = (page - 1) * limit;

        const results = await Portfolio.find()
            .skip(skip)
            .limit(parseInt(limit));


        res.json({ results });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los resultados' });
    }
};

const getSuggestions = async (query) => {
    return await Portfolio.find({
        $or: [
            { title: { $regex: `.*${query}.*`, $options: 'i' } },
            { description: { $regex: `.*${query.slice(0, 3)}.*`, $options: 'i' } }
        ]
    }).limit(5);
};

export const searchPortfolio = async (req, res) => {
    const { query, page = 1, limit = 10 } = req.query;

    try {
        const allData = await Portfolio.find().lean();
        console.log('All data:', allData);
       
        const options = {
            keys: ['name', 'description', 'technology', 'images','works'],
            threshold: 0.3,  
        };

        const fuse = new Fuse(allData, options);
        const results = fuse.search(query);

        // Si encuentra resultados
        if (results.length > 0) {
            const paginatedResults = results
                .slice((page - 1) * limit, page * limit)
                .map(result => result.item);

            return res.json({
                results: paginatedResults,
                totalResults: results.length,
                currentPage: Number(page),
                totalPages: Math.ceil(results.length / limit),
            });
        }

        // Si no encuentra resultados, ajusta el threshold para sugerencias
        const suggestionOptions = { ...options, threshold: 0.6 }; // Más tolerante
        const suggestionFuse = new Fuse(allData, suggestionOptions);
        const suggestions = suggestionFuse.search(query).map(s => s.item);

        // Devuelve las sugerencias si están disponibles
        return res.status(200).json({
            message: 'No se encontraron resultados exactos.',
            suggestions: suggestions.slice(0, 5), // Limitar a las 5 mejores sugerencias
        });
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        return res.status(500).json({ message: 'Error en la búsqueda' });
    }
};

export const searchById = async (req, res) => {
    const { id } = req.query;
    try {

        const result = await Portfolio.findById(id);

        if (!result) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }
        res.status(200).json({
            result: result
        });
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        res.status(500).json({ message: 'Error en la búsqueda' });
    }

}
export const createMultiplePortfolios = async (req, res) => {
    const portfolios = req.body;   

    try {
         if (!Array.isArray(portfolios) || portfolios.length === 0) {
            return res.status(400).json({ message: 'Debe proporcionar una lista de portafolios' });
        }

         const validPortfolios = portfolios.map((portfolio) => {
            if (!portfolio.name || !portfolio.description || !portfolio.technology) {
                return null;   
            }
            return {
                name: portfolio.name,
                description: portfolio.description,
                technology: portfolio.technology,
                images: portfolio.images || []
            };
        }).filter(Boolean);  

        if (validPortfolios.length === 0) {
            return res.status(400).json({ message: 'No se encontraron portafolios válidos' });
        }

         const savedPortfolios = await Portfolio.insertMany(validPortfolios);

         res.status(201).json({
            message: 'Portafolios creados exitosamente',
            portfolios: savedPortfolios
        });
    } catch (error) {
        console.error('Error al crear los portafolios:', error);
        res.status(500).json({ message: 'Error al crear los portafolios' });
    }
};
