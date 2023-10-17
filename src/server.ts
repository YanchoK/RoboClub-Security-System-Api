import express, { Request, Response } from 'express';
import cors from 'cors';
import member_routes from './routes/member_routes';

const app = express();
app.use(cors());
app.use(express.json())


app.get("/api", (req: Request, res: Response): void => {
    try {
        res.send("<p>Helloo!</p>")
        // res.json({ message: "Hello World!" })
    } catch (error: any) {
        res.send(error.message)
    }
})


app.use('/api/members', member_routes);


const PORT: Number = 3000
app.listen(PORT, () => {
    console.log(`Server is listenning on http://localhost:${PORT}/`)
})














