import express, { application } from "express";
import cors from 'cors';
import methodOverride from 'method-override';
import db from './db/index.js';
import dotenv from 'dotenv';
import { getDirName } from "./getDirName.js";
import validInfo from "./validInfo.js";
// import bcrypt from 'bcrypt';
//  import jwtAuth from './JwtAuth.js'; //these are unused - don't import them here.

 // TODO : 
// AT 3:35 finish chap 7

// if theres anything I've learned from this it's that 
// whitelisting is nice.
// along with all the cmds that will help in the future

// import jwtSeed from './JwtSeed.js'; 
const port = 8080;
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
app.use(cors());
//app.use('/public', express.static('public'));
app.use(express.static(dirName + '/public')); // Keep

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
        const results = db.query("DELETE FROM store_item where id = $1", [
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

// deleting an user done
app.delete('/users/:id', async (req, res) => {
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

// delete 

app.delete("/cart/:id", async (req, res) => {
    const { id } = req.params;
    const { name, quantity, us, ps, image } = req.body;
        try {
            // the result data needs to be in the same order as the one in the braces.
            // that was probably the only issue.
            const results = await db.query('DELETE FROM cart WHERE name = $1, quantity = $2, us = $3, ps = $4 image = $5, WHERE id = $6',
                [
                    name, quantity,
                    us, ps, image
                ]);
            console.log(results);
            console.log('====================================');
            res.json(results);
            console.log('====================================');
            console.log(res);
            console.log('====================================');
        } catch(e) {
            console.log(e);
        }
}); 

// 'add to cart'?????? // this could also 
app.put("/cart/:id", async (req, res) => {
    const { id } = req.params; // cart items ids
    // a different const for cart goes here
    const { name, quantity, us, ps, image } = req.body;
    try {
        const results = await db.query(`UPDATE cart SET name = $1, quantity = $2, us = $3, ps = $4, image = $5 WHERE id = $6`,
            [name, quantity, us, ps, image, id]);
	//call cart here as another await: have it lookup these credentials
        console.log(results);
        console.log('====================================');
        res.json(results);
        console.log('====================================');
        console.log(res);
        console.log('====================================');
    } catch (error) {
        console.log(error);
    }
    // then it is the model of listing items 
    // out of sql
});

// update
// done

// crud for cart minus update
// create
app.post("/cart", validInfo, async (req, res) => {
    // getting userdata from table
    // 
    try {
        const send = await db.query(`INSERT INTO cart(id, name, quantity, us, ps, image) values ($1, $2, $3, $4, $5) returning *;`,
            [
                req.body.id, req.body.name, req.body.quantity, req.body.us, req.body.ps, req.body.image
            ]
        );
        console.log(send);
        res.status(201).json({
            status: "success",
            data: {
                user: results.rows[0],
            },
        });
    } catch (error) {
        console.log(error);
    }
});

//create a users

app.post("/signup", validInfo, async (req, res) => {
 try{
        const results = await db.query(`INSERT INTO users(id, us, ps) values ($1, $2, $3) returning *;`,
            [
                req.body.id, req.body.us, req.body.ps
            ]
    );
console.log(send);
res.status(201).json({
	status: "success",
	data: {
		    user: results.rows[0],
		},
	});
}
catch(error){
   console.log(error);
}
});

// create 
app.post("/invItem", async (req, res) => {
    try {
        const results = await db.query(`INSERT INTO store_item(id, name, price, description, image, quantity, category_id, sku) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *;`,
            [
                req.body.id, req.body.name, req.body.price,
                req.body.description, req.body.image,
                req.body.quantity, req.body.category_id,
                req.body.sku
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
});

// GET ALL\ CART items for user 
app.get("/cart/:id", async (req, res) => {
    const { id } = req.params;
    const { name, quantity, us, ps, image } = req.body;
            // anything where that us matches with the item us
        try {
            const itemas = await db.query(`SELECT name, quantity, image FROM cart, users WHERE cart.us = users.us;`, [
                name, quantity,
                us, ps, image
            ]);
            console.log(itemas);
            res.json(itemas.rows);
        } catch (error) { console.log(error); }
});

// welcome
app.get('/', (req, res) => {
    res.send("hola");
})

app.get('/users', async (req, res) => {
    try {
        const userbase = await db.query('SELECT * FROM users');
        console.log('====================================');
        console.log(userbase);
        console.log('====================================');
        res.json(userbase.rows);
    } catch (error) {
        console.log(error);
    }
});

// get one user
app.get("/users/:id", async (req, res) => {
    console.log(req.body);
    try {
        const results =
            await db.query(`SELECT * FROM users where id = $1`,
                [req.params.id]);
        console.log('====================================');
        console.log(results);
        console.log('====================================');
        res.status(200).json({
            status: "success",
            data: {
                user: results.rows[0]
            }
        });
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
    }
})

// GET ALL\ items
app.get("/invItem/getAll", async (req, res) => {
    try {
        const itemas = await db.query('SELECT * FROM store_item');
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
            await db.query(`SELECT * FROM store_item WHERE id = $1`,
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