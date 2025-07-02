import express from 'express';
const usersRouter = express.Router();
import { getUser, updateUser } from '../controllers/UsersController.js';
/**
* @swagger
* /users:
*   get:
*     tags: [Users]
*     summary: קבלת פרטי משתמש לפי מספר זהות
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: idNumber
*         required: true
*         schema:
*           type: string
*         description: מספר זהות של המשתמש
*     responses:
*       200:
*         description: פרטי המשתמש הוחזרו בהצלחה
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: number
*                 userName:
*                   type: string
*                 idNumber:
*                   type: string
*                 pw:
*                   type: string
*                   description: סיסמא מוצפנת
*       403:
*         description: משתמש לא מורשה לבצע פעולה זו
*/
usersRouter.get('/:idNumber', getUser);
/**
* @swagger
* /users:
*   put:
*     tags: [Users]
*     summary: עדכון פרטי משתמש לפי מספר זהות
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: idNumber
*         required: true
*         schema:
*           type: string
*         description: מספר זהות של המשתמש לעדכון
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               newUser:
*                 type: object
*                 properties:
*                   id:
*                     type: number
*                   userName:
*                     type: string
*                   idNumber:
*                     type: string
*                   pw:
*                     type: string
*                     description: סיסמא חדשה
*     responses:
*       200:
*         description: פרטי המשתמש עודכנו בהצלחה
*       403:
*         description: משתמש לא מורשה לבצע פעולה זו
*       500:
*         description: שגיאה פנימית בשרת בעת עדכון המשתמש
*/
usersRouter.put('/:idNumber', updateUser);
export default usersRouter;
