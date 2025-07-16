import express from 'express';
const businessRouter = express.Router();
import { getBusiness, updateBusiness, deleteBusiness, getBusinessesDetails, getBusinessByID } from '../controllers/BusinessController.js';
/**
* @swagger
* /business:
*   get:
*     tags: [Business]
*     summary: קבלת פרטי העסק של המשתמש הנוכחי
*     security:
*        - bearerAuth: []
*     responses:
*       200:
*         description: פרטי העסק הוחזרו בהצלחה
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: number
*                 businessName:
*                   type: string
*                 userId:
*                   type: number
*                 email:
*                   type: string
*                 phone:
*                   type: string
*                 businessAddress:
*                   type: string
*                 details:
*                   type: string
*/
businessRouter.get('/', getBusiness);
businessRouter.get('/all', getBusinessesDetails);
/**
* @swagger
* /business/{id}:
*   get:
*     tags: [Business]
*     summary: קבלת פרטי העסק לפי מזהה
*     parameters:
*       - in: path
*        name: id
*       description: מזהה העסק לקבלת הפרטים
*       required: true
*       schema:
*        type: number
*     security:
*        - bearerAuth: []
*     responses:
*       200:
*         description: פרטי העסק הוחזרו בהצלחה
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: number
*                 businessName:
*                   type: string
*                 userId:
*                   type: number
*                 email:
*                   type: string
*                 phone:
*                   type: string
*                 businessAddress:
*                   type: string
*                 details:
*                   type: string
*/
businessRouter.get('/:id', getBusinessByID);
/**
* @swagger
* /business:
*   put:
*     tags: [Business]
*     summary: עדכון פרטי העסק של המשתמש הנוכחי
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               businessName:
*                 type: string
*               businessAddress:
*                 type: string
*               phone:
*                 type: string
*               email:
*                 type: string
*               details:
*                 type: string
*     responses:
*       200:
*         description: העסק עודכן בהצלחה
*       500:
*         description: שגיאה בעדכון העסק
*/
businessRouter.put('/', updateBusiness);
/**
* @swagger
* /business:
*   delete:
*     tags: [Business]
*     summary: מחיקת עסק לפי מזהה
*     security:
*           - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         description: מזהה העסק למחיקה
*         required: true
*         schema:
*           type: number
*     responses:
*       200:
*         description: העסק נמחק בהצלחה
*       500:
*         description: שגיאה במחיקת העסק
*/
businessRouter.delete('/:id', deleteBusiness);
export default businessRouter;
