import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import AttendanceModel from './models/attendance.model'
// import * as database from './config/database'

dotenv.config()
require('./config/database')

const apiV1 =  express.Router()

const app =  express()

app.use(express.json())

const allowedOrigins = ['https://espartanitos.netlify.app', 'http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions))

app.use('/api/v1', apiV1)

apiV1.get('/attendance', async (req: Request, res: Response) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    try {
        const data = await AttendanceModel.find({});
        if (!data) {
            return res.status(404).json({ message: 'No attendance data found' });
        }

        const filteredData = data.map((student) => {
            const filteredAttendance = Array.from(student.attendance.entries())
                .filter(([date]) => date.split("/")[1] == month)
                .reduce((obj: any, [key, value]) => {
                    obj[key] = value;
                    return obj;
                }, {});

            return {
                name: student.name,
                attendance: filteredAttendance,
            };
        }).filter(student => Object.keys(student.attendance).length > 0);
    
        res.json(filteredData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance data' });
    }
});

apiV1.post('/attendance', async (req: Request, res: Response) => {
    const { newAttendance } = req.body;

    if (!newAttendance || !Array.isArray(newAttendance)) {
        return res.status(400).json({ message: 'Invalid data format' });
    }

    try {
        for (const entry of newAttendance) {
            const name = Object.keys(entry)[0];
            const attendance = entry[name];
    
            if (!name || !attendance) {
            return res.status(400).json({ message: 'Name and attendance are required for each entry' });
            }
    
            await AttendanceModel.updateOne(
                { name },
                { $set: { [`attendance.${Object.keys(attendance)[0]}`]: Object.values(attendance)[0] } },
                { upsert: true }
            );
        }
        res.status(201).json({ message: 'Attendance data added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding attendance data' });
    }
});

app.listen(8080, () => console.log('Server running on port 8080'))

