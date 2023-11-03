import express, { application } from "express";
import cors from 'cors';
import methodOverride from 'method-override';
import db from './db/index.js';
import dotenv from 'dotenv';
import { getDirName } from "./getDirName.js";
import validInfo from "./validInfo.js";
import bcrypt from 'bcrypt';
// import jwtAuth from './JwtAuth.js'; these are unused - don't import them here.
// import jwtSeed from './JwtSeed.js'; 
const port = 3000;
const app = express();
const dirName = getDirName(import.meta.url);
/*
Express Middleware

    React -> Request -> Node/Express  
                        middleware v
    ^  Response    <-  Route-Handler
                        
*/
dotenv.config();
//induces order 
//use
//set 
//engine
//delete d
//put u
//post c
//get r
//listen
//

// creates a new middle ware function to override
// the req method property with a new value
app.use(methodOverride("_method"));

//app.use('/public', express.static('public'));
app.use(express.static(dirName + '/public')); // Keep
app.use(cors());
app.use(express.json()); // serve files from public statically
//parsing incomming requests
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log("I run for all routes");
    next();
});
// Delete an item

app.delete("/invItem/:id", async (req, res) => {
    try {
        const results = db.query("DELETE FROM product where id = $1", [
            req.params.id
        ]);
        res.status(204).json({
            status: "success",
        });
        console.log(results);
    } catch (err) {
        console.log(err);
    }
})

// deleting an item
app.delete('/cart/:id', async (req, res) => {
    try {
        const results = db.query("DELETE FROM users where id = $1", [
            req.params.id
        ])
    res.status(204).json({
            status: "success",
        });
        console.log(results);
    } catch (err) {
        console.log(err);
    }
})

// 'add to cart'??????
app.put("/cart/:id", async (req, res) => {

})

// update
// yes just because of this assignment
// but im using patch instead
app.patch("/invItem/:id", async (req, res) => {
    try {
        const results = db.query(`UPDATE product SET name = $1, price = $2, description = $3, image = $4, quantity = $5, category_id = $6, sku = $7 where id = $8 returning *;`,
            [req.body.id, req.body.name, req.body.price, req.body.description, req.body.image, req.body.quantity, req.body.category_id, req.body.sku]);
        console.log(results);
        res.status(201).json({
            status: "success",
            data: {
                item: results.rows[0],
            },
        });
        console.log(res);
    } catch(e) {
        console.log(e);
    }
});

// create a users
app.post("/users", async (req, res) => {
    // getting userdata from table
    // 
    try {
        const send = await db.query(`INSERT INTO users(id, us, ps, cartInv) values ($1, $2, $3, $4) returning *;`,
            [
                req.body.id, req.body.us, req.body.ps, req.body.cartInv
            ]
        );
        console.log(send);
        res.status(201).json({
            status: "success",
            data: {
                item: results.rows[0],
            },
        });
    } catch (error) {
        console.log(error);
    }
})

app.post("/signup", validInfo, async (req, res) => {

});

// create 
app.post("/invItem", async (req, res) => {
    try {
        const results = await db.query(`INSERT INTO product(id, name, price, description, image, quantity, category_id, sku) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *;`,
            [
                req.body.id, req.body.name, req.body.price, req.body.description, req.body.image,
                req.body.quantity, req.body.category_id, req.body.sku
            ]
        );
        console.log(results);
        res.status(201).json({
            status: "success",
            data: {
                item: results.rows[0],
            },
        });
    } catch (error) {
        console.log(error);
    }
})

// welcome
app.get('/', (req, res) => {
    res.send("hola");
})

app.get('/users', async (req, res) => {
    try {
        const userbase = await db.query('SELECT * FROM users');
    } catch (error) {
        
    }
})

// GET ALL\ items
app.get("/invItem/getAll", async (req, res) => {
    try {
        const itemas = await db.query('SELECT * FROM product');
        console.log(itemas);
        res.json(itemas.rows);
    } catch (error) { console.log(error); }
});

// Get one specific item
// show
app.get("/invItem/show/:id", async (req, res) => {
    console.log(req.body);
    try {
        const results =
            await db.query(`SELECT * FROM product WHERE id = $1`,
                [req.params.id]);
        console.log(results);
        res.status(200).json({
            status: "success",
            data: {
                item: results.rows[0]
            }
        });
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log
        (`server is up and listening on port ${port}`);
});