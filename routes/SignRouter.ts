import express from 'express';
const signRouter = express.Router();
import { signIn, signUp } from '../controllers/signController.js';
/**
* @swagger
* /signIn:
*   post:
*     tags: [Sign]
*     summary: כניסת משתמש
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*                userName:
*                 type: string
*                password:
*                 type: string
*     responses:
*       200:
*         description: המשתמש והעסק נוספו בהצלחה
*/
signRouter.post('/signIn', signIn);
/**
* @swagger
* /signUp:
*   post:
*     tags: [Sign]
*     summary: כניסת משתמש חדש
*     security:
*       - bearerAuth: []
*     description: יצירת משתמש חדש במערכת עם פרטי משתמש ועסק
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*                newBusiness:
*                 type: object
*                 properties:
*                     businessName:
*                          type: string
*                     userId:
*                          type: number
*                     email:
*                          type: string
*                     phone:
*                          type: string
*                     businessAddress:
*                          type: string
*                     details:
*                          type: string
*                newUser:
*                 type: object
*                 properties:
*                    userName:
*                          type: string
*                    idNumber:
*                          type: string
*                    pw:
*                          type: string
*     responses:
*       200:
*         description: המשתמש והעסק נוספו בהצלחה
*/
signRouter.post('/signUp', signUp);
export default signRouter;