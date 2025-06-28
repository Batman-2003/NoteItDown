import express from 'express';
import { createConnection } from 'mysql2';
import { hash } from 'bcrypt';
import { json } from 'body-parser';

const app=express();
app.use(json);

const db=createConnection({
    host:'localhost',
    user:'root',
    password:'BATMAN HATES Hackrs',
    database:'NoteItDown'
});

db.connect((err)=>{
    if(err)throw err;
        console.log('Connected to MySql!');
    }
);
 
// -------------------------- Sign-up ---------------------------------------
app.post('/signup',async (req, res)=>{
    const {username,password}=req.body;

    if (!username|| !password){
        return res.status(400).json({error:"Username and Password required"});
    }
    try {
        db.query('SELECT * FROM users WHERE username=?',[username],async (err,results)=>{
            if(err) throw err;
            if(results.length>0){
                return res.status(409).json({
                    error: "Username already exists."
                });
            }
            const hashedPassword = await hash(password, 10);

            db.query(
                'INSERT INTO users (username, password) VALUES(?, ?)',
                [username, hashedPassword],
                (err, result) => {
                    if (err) throw err;
                    return res.status(201).json( {message: "User registered successfully."});
                }
            );
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Server error.' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log("Server running on http://localhost:${PORT}")
});