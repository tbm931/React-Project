import express from 'express';
const servicesRouter = express.Router();
import { getServicesById, getServices, createService, updateService, deleteService } from '../controllers/ServicesController.js';
/**
* @swagger
* /services:
*   get:
*     tags: [Services]
*     summary: קבלת כל השירותים עבור הלקוח הנוכחי
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: השירותים הוחזרו בהצלחה
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: number
*                   serviceName:
*                     type: string
*                   serviceDescription:
*                     type: string
*                   durationMinutes:
*                     type: number
*                   price:
*                     type: number
*                   isActive:
*                     type: boolean
*                   businessId:
*                     type: number
*/
servicesRouter.get('/', getServices);
/**
* @swagger
* /services/byBusinessId/{id}:
*   get:
*     tags: [Services]
*     summary: קבלת כל השירותים עבור הלקוח הנוכחי
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: number
*         description: מזהה העסק
*     responses:
*       200:
*         description: השירותים הוחזרו בהצלחה
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: number
*                   serviceName:
*                     type: string
*                   serviceDescription:
*                     type: string
*                   durationMinutes:
*                     type: number
*                   price:
*                     type: number
*                   isActive:
*                     type: boolean
*                   businessId:
*                     type: number
*/
servicesRouter.get('/:id', getServicesById);
/**
* @swagger
* /services:
*   post:
*     tags: [Services]
*     summary: יצירת שירות חדש
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required: [businessName, newService]
*             properties:
*               businessName:
*                 type: string
*               newService:
*                 type: object
*                 properties:
*                   serviceName:
*                     type: string
*                   serviceDescription:
*                     type: string
*                   durationMinutes:
*                     type: number
*                   price:
*                     type: number
*                   isActive:
*                     type: boolean
*     responses:
*       200:
*         description: השירות נוצר בהצלחה
*       403:
*         description: אין הרשאה ליצור שירות זה
*       500:
*         description: שגיאה פנימית בשרת
*/
servicesRouter.post('/', createService);
/**
* @swagger
* /services:
*   put:
*     tags: [Services]
*     summary: עדכון שירות קיים (לפי שם)
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - newService
*             properties:
*               newService:
*                 type: object
*                 properties:
*                   serviceName:
*                     type: string
*                   serviceDescription:
*                     type: string
*                   durationMinutes:
*                     type: number
*                   price:
*                     type: number
*                   isActive:
*                     type: boolean
*     responses:
*       200:
*         description: השירות עודכן בהצלחה
*       403:
*         description: אין הרשאה לעדכן שירות זה
*       500:
*         description: שגיאה פנימית בשרת
*/
servicesRouter.put('/', updateService);
/**
* @swagger
* /services:
*   delete:
*     tags: [Services]
*     summary: מחיקת שירות לפי שם
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: name
*         required: true
*         schema:
*           type: string
*         description: שם השירות למחיקה
*     responses:
*       200:
*         description: השירות נמחק בהצלחה
*       403:
*         description: אין הרשאה למחוק שירות זה
*       500:
*         description: שגיאה פנימית בשרת
*/
servicesRouter.delete('/:name', deleteService);
export default servicesRouter;
