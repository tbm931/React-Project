import express from 'express';
const meetingsRouter = express.Router();
import { getMeetings, getMeeting, createMeeting, updateMeeting, deleteMeeting } from '../controllers/MeetingsController.js';
/**
* @swagger
* /meetings:
*   get:
*     tags: [Meetings]
*     summary: קבלת רשימת כל הפגישות
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: רשימת הפגישות הוחזרה בהצלחה
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
*                   meetingStatus:
*                     type: string
*                   notes:
*                     type: string
*                   priceAtTime:
*                     type: number
*                   meetingDate:
*                     type: string
*                     format: date-time
*/
meetingsRouter.get('/', getMeetings);
/**
* @swagger
* /meetings:
*   get:
*     tags: [Meetings]
*     summary: קבלת פגישה לפי מזהה
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: meetingId
*         required: true
*         schema:
*           type: number
*         description: מזהה הפגישה
*     responses:
*       200:
*         description: פרטי הפגישה הוחזרו בהצלחה
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
*                 meetingStatus:
*                   type: string
*                 notes:
*                   type: string
*                 priceAtTime:
*                   type: number
*                 meetingDate:
*                   type: string
*                   format: date-time
*/
meetingsRouter.get('/:meetingId', getMeeting);
/**
* @swagger
* /meetings:
*   post:
*     tags: [Meetings]
*     summary: יצירת פגישה חדשה
*     security:
*       - bearerAuth: []
*      parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: number
*         description: מזהה העסק
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - newMeeting
*             properties:
*               newMeeting:
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
*                   meetingStatus:
*                     type: string
*                   notes:
*                     type: string
*                   priceAtTime:
*                     type: number
*                   meetingDate:
*                     type: string
*                     format: date-time
*     responses:
*       200:
*         description: הפגישה נוצרה בהצלחה
*       403:
*         description: משתמש לא מורשה לבצע פעולה זו
*       500:
*         description: שגיאה בשרת בעת יצירת הפגישה
*/
meetingsRouter.post('/:id', createMeeting);
/**
* @swagger
* /meetingsmeetingId}:
*   put:
*     tags: [Meetings]
*     summary: עדכון פגישה קיימת לפי מזהה
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: meetingId
*         required: true
*         schema:
*           type: number
*         description: מזהה הפגישה לעדכון
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - newMeeting
*             properties:
*               newMeeting:
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
*                   meetingStatus:
*                     type: string
*                   notes:
*                     type: string
*                   priceAtTime:
*                     type: number
*                   meetingDate:
*                     type: string
*                     format: date-time
*     responses:
*       200:
*         description: הפגישה עודכנה בהצלחה
*       403:
*         description: משתמש לא מורשה לבצע פעולה זו
*       500:
*         description: שגיאה בשרת בעת עדכון הפגישה
*/
meetingsRouter.put('/:meetingId', updateMeeting);
/**
* @swagger
* /meetings:
*   delete:
*     tags: [Meetings]
*     summary: מחיקת פגישה לפי מזהה פגישה ומזהה שירות
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: meetingId
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
*         description: הפגישה נמחקה בהצלחה
*       403:
*         description: משתמש לא מורשה לבצע פעולה זו
*       500:
*         description: שגיאה בשרת בעת מחיקת הפגישה
*/
meetingsRouter.delete('/:meetingId/:serviceId', deleteMeeting);
export default meetingsRouter;
