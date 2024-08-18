import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    attendance: { 
        type: Map, 
        of: new mongoose.Schema({
            status: { type: Boolean, required: true },
            type: { type: String, required: true },
        }), 
        required: true 
    },
});

const AttendanceModel = mongoose.model('Attendance', attendanceSchema);

export default AttendanceModel;
