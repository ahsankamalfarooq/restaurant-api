import express from 'express';
import mongoose from 'mongoose';
import { APP_PORT, DB_URL } from './config';
import errorHandler from './middlewares/errorHandler';
import router from './routes';
const app = express();
import path from 'path';


//Data Base Connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology : true,
 //useFindAndModify: false
})

const db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
db.once('open', () => {
    console.log('DB Connected...');
});


global.appRoot = path.resolve(__dirname); 
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use('/api', router)

app.use('/uploads', express.static('uploads'));





app.use(errorHandler)
app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}.`))