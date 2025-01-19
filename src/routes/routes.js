import { Router } from 'express'
import { getPortfolio, getAllPortfolio, searchPortfolio, searchById,createMultiplePortfolios } from '../controllers/portfolio.controller.js'
import { getAllExperience,postExperience } from '../controllers/experience.controller.js'

const router = Router()
router.get('/getPortfolio', getPortfolio)
router.get('/getAllPortfolio', getAllPortfolio);
router.get('/searchPortfolio', searchPortfolio);
router.get('/searchById', searchById);
router.post('/createMultiplePortfolios', createMultiplePortfolios);

router.get('/getAllExperience', getAllExperience);
router.post('/postExperience', postExperience);

export default router
