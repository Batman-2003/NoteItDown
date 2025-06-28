const express=require('express');
const mysql=require('mysql2');
const bcrypt=require('bcrypt');
const bodyParser=require('body-parser');
const cors = require('cors');


const app=express();
app.use(cors({
  origin: 'http://localhost:3000', // your frontend address
  credentials: true
}));

app.use(bodyParser.json());

const db=mysql.createConnection({
    host:'localhost',
    user:'gaurav',
    password:'password',
    database:'NoteItDown'
});

db.connect((err)=>{
    if(err) console.log(err) ;
        console.log('Connected to MySql!');
    }
);
 
// -------------------------- Sign-up ---------------------------------------
app.post('/signup',async (req, res)=>{
    const {username,password}=req.body; // Request from Frontend SignUp form.

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
            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                'INSERT INTO users (username, password) VALUES(?, ?)',
                [username, hashedPassword],
                (err, result) => {
                    if (err) console.error(err);
                    return res.status(201).json( {message: "User registered successfully."});
                }
            );
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Server error.' });
    }
});


// ------------------------------------ Login ----------------------------------

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
  
    try {
      // Check if user exists
      const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      const user = users[0];
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Success
      res.json({ message: 'Login successful', userId: user.id, username: user.username });
  
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  



const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});