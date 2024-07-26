import mongoose from 'mongoose'
console.log(process.env.MONGO_DB)
mongoose.connect(process.env.MONGO_DB!)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err))
