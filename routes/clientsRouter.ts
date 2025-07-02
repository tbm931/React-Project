import express from 'express';
const clientsRouter = express.Router();
import { getClients, getClient, createClient, updateClient } from '../controllers/clientsController.js';

/**
* @swagger
* /clients:
*   get:
*     tags: [Clients]
*     summary: קבלת רשימת כל הלקוחות
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: רשימת הלקוחות הוחזרה בהצלחה
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: number
*                   idNumber:
*                     type: string
*                   clientName:
*                     type: string
*                   birthDate:
*                     type: string
*                     format: date
*                   phone:
*                     type: string
*                   email:
*                     type: string
*                   notes:
*                     type: string
*/
clientsRouter.get("/", getClients);

/**
* @swagger
* /clients:
*   get:
*     tags: [Clients]
*     summary: קבלת פרטי לקוח לפי מספר זהות
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: idNumber
*         required: true
*         schema:
*           type: string
*         description: מספר זהות של הלקוח
*     responses:
*       200:
*         description: פרטי הלקוח הוחזרו בהצלחה
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: number
*                 idNumber:
*                   type: string
*                 clientName:
*                   type: string
*                 birthDate:
*                   type: string
*                   format: date
*                 phone:
*                   type: string
*                 email:
*                   type: string
*                 notes:
*                   type: string
*       500:
*         description: לא נמצא לקוח עם מספר הזהות המבוקש
*/
clientsRouter.get('/:idNumber', getClient);

/**
* @swagger
* /clients:
*   post:
*     tags: [Clients]
*     summary: יצירת לקוח חדש
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               newClient:
*                 type: object
*                 required:
*                   - idNumber
*                   - clientName
*                   - birthDate
*                 properties:
*                   idNumber:
*                     type: string
*                   clientName:
*                     type: string
*                   birthDate:
*                     type: string
*                     format: date
*                   phone:
*                     type: string
*                   email:
*                     type: string
*                   notes:
*                     type: string
*     responses:
*       200:
*         description: הלקוח נוצר בהצלחה
*       500:
*         description: שגיאה ביצירת הלקוח
*/
clientsRouter.post('/', createClient);

/**
* @swagger
* /clients:
*   put:
*     tags: [Clients]
*     summary: עדכון פרטי לקוח לפי מספר זהות
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: idNumber
*         required: true
*         schema:
*           type: string
*         description: מספר זהות של הלקוח לעדכון
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               newClient:
*                 type: object
*                 properties:
*                   clientName:
*                     type: string
*                   birthDate:
*                     type: string
*                     format: date
*                   phone:
*                     type: string
*                   email:
*                     type: string
*                   notes:
*                     type: string
*     responses:
*       200:
*         description: פרטי הלקוח עודכנו בהצלחה
*       500:
*         description: שגיאה בעדכון הלקוח
*/
clientsRouter.put('/:idNumber', updateClient);

export default clientsRouter;