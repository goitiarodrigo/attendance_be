import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    attendance: { type: Map, of: Boolean, required: true },
});

const AttendanceModel = mongoose.model('Attendance', attendanceSchema);

export default AttendanceModel;
