import { Router } from 'express'
import { getPortfolio, getAllPortfolio, searchPortfolio, searchById } from '../controllers/portfolio.controller.js'


const router = Router()
router.get('/getPortfolio', getPortfolio)
router.get('/getAllPortfolio', getAllPortfolio);
router.get('/searchPortfolio', searchPortfolio);
router.get('/searchById', searchById);

export default router
