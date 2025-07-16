import express from 'express';
import { protect } from "./middleware/authMiddleware.js";
import meetingsRouter from './routes/MeetingsRouter.js'
import clientsRouter from './routes/ClientsRouter.js';
import servicesRouter from "./routes/ServicesRouter.js";
import usersRouter from "./routes/UsersRouter.js";
import cors from 'cors';
import { swaggerUi, specs } from "./swagger.js";
import businessRouter from "./routes/BusinessRouter.js";
import dotenv from 'dotenv';
import { signIn, signUp } from './controllers/signController.js';
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));
/**
 * @swagger
 * /signIn:
 *   post:
 *     tags: 
 *        -Sign
 *     summary: כניסת משתמש
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
app.post('/signIn', signIn);
/**
 * @swagger
 * /signUp:
 *   post:
 *     tags: 
 *        -Sign
 *     summary: כניסת משתמש חדש
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
app.post('/signUp', signUp);
app.use(protect);
app.use('/meetings', meetingsRouter)
app.use('/clients', clientsRouter)
app.use('/services', servicesRouter)
app.use('/users', usersRouter)
app.use('/business', businessRouter)

app.listen(process.env.PORT, (error) => {
  if (!error)
    console.log("Server is Successfully Running, and App is listening on port " + process.env.PORT)
  else
    console.log("Error occurred, server can't start", error);
});