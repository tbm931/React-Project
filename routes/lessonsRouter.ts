import express from 'express';
const lessonsRouter = express.Router();
import { getLessons, getLesson, createLesson, updateLesson, deleteLesson } from '../controllers/lessonsController.js';

/**
* @swagger
* /lessons:
*   get:
*     tags: [Lessons]
*     summary: קבלת רשימת כל השיעורים
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: רשימת השיעורים הוחזרה בהצלחה
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: number
*                   clientId:
*                     type: number
*                   serviceId:
*                     type: number
*                   scheduledAt:
*                     type: string
*                     format: date-time
*                   durationMinutes:
*                     type: number
*                   lessonStatus:
*                     type: string
*                   notes:
*                     type: string
*                   priceAtTime:
*                     type: number
*                   lessonDate:
*                     type: string
*                     format: date-time
*/
lessonsRouter.get('/', getLessons);

/**
* @swagger
* /lessons:
*   get:
*     tags: [Lessons]
*     summary: קבלת שיעור לפי מזהה
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: lessonId
*         required: true
*         schema:
*           type: number
*         description: מזהה השיעור
*     responses:
*       200:
*         description: פרטי השיעור הוחזרו בהצלחה
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: number
*                 clientId:
*                   type: number
*                 serviceId:
*                   type: number
*                 scheduledAt:
*                   type: string
*                   format: date-time
*                 durationMinutes:
*                   type: number
*                 lessonStatus:
*                   type: string
*                 notes:
*                   type: string
*                 priceAtTime:
*                   type: number
*                 lessonDate:
*                   type: string
*                   format: date-time
*/
lessonsRouter.get('/:lessonId', getLesson);

/**
* @swagger
* /lessons:
*   post:
*     tags: [Lessons]
*     summary: יצירת שיעור חדש
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - newLesson
*             properties:
*               newLesson:
*                 type: object
*                 properties:
*                   clientId:
*                     type: number
*                   serviceId:
*                     type: number
*                   scheduledAt:
*                     type: string
*                     format: date-time
*                   durationMinutes:
*                     type: number
*                   lessonStatus:
*                     type: string
*                   notes:
*                     type: string
*                   priceAtTime:
*                     type: number
*                   lessonDate:
*                     type: string
*                     format: date-time
*     responses:
*       200:
*         description: השיעור נוצר בהצלחה
*       403:
*         description: משתמש לא מורשה לבצע פעולה זו
*       500:
*         description: שגיאה בשרת בעת יצירת השיעור
*/
lessonsRouter.post('/', createLesson);

/**
* @swagger
* /lessonslessonId}:
*   put:
*     tags: [Lessons]
*     summary: עדכון שיעור קיים לפי מזהה
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: lessonId
*         required: true
*         schema:
*           type: number
*         description: מזהה השיעור לעדכון
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - newLesson
*             properties:
*               newLesson:
*                 type: object
*                 properties:
*                   clientId:
*                     type: number
*                   serviceId:
*                     type: number
*                   scheduledAt:
*                     type: string
*                     format: date-time
*                   durationMinutes:
*                     type: number
*                   lessonStatus:
*                     type: string
*                   notes:
*                     type: string
*                   priceAtTime:
*                     type: number
*                   lessonDate:
*                     type: string
*                     format: date-time
*     responses:
*       200:
*         description: השיעור עודכן בהצלחה
*       403:
*         description: משתמש לא מורשה לבצע פעולה זו
*       500:
*         description: שגיאה בשרת בעת עדכון השיעור
*/
lessonsRouter.put('/:lessonId', updateLesson);

/**
* @swagger
* /lessons:
*   delete:
*     tags: [Lessons]
*     summary: מחיקת שיעור לפי מזהה שיעור ומזהה שירות
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: lessonId
*         required: true
*         schema:
*           type: number
*       - in: path
*         name: serviceId
*         required: true
*         schema:
*           type: number
*     responses:
*       200:
*         description: השיעור נמחק בהצלחה
*       403:
*         description: משתמש לא מורשה לבצע פעולה זו
*       500:
*         description: שגיאה בשרת בעת מחיקת השיעור
*/
lessonsRouter.delete('/:lessonId/:serviceId', deleteLesson);

export default lessonsRouter;