import express from 'express'
import { auth } from '../middlewares/auth.js'
import { userRegisterbyAdmin,terminateUser } from '../controller/admin.controller.js'


const router=express.Router()



router.post('/create/user',auth,userRegisterbyAdmin)
router.delete('/terminate/user/:userId',auth,terminateUser)



export default router