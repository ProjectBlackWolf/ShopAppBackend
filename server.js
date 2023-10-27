import express, { application } from "express";
import cors from 'cors';
import methodOverride from 'method-override';
import db from './db/index.js';
import dotenv from 'dotenv';
import { getDirName } from "./getDirName.js";
import morgan from 'morgan';
import validInfo from "./validInfo.js";
import JwtSeed from './JwtSeed.js';
// const port = process.env.PORT || 3005;

const dirName = getDirName(import.meta.url);
const app = express();
/*
Express Middleware

    React -> Request -> Node/Express  
                        middleware v
    ^  Response    <-  Route-Handler
                        
*/
dotenv.config();
const port = 3000; // port always comes after dotenv

//induces hierarchy 
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
// app.use("/authentication", require("./jwtAuth"));
// app.use("/dashboard", require("./dashboard"));
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
        const results = db.query("DELETE FROM product where id = $1;", [
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

// // deleting an item
app.delete('/orders/:id', async (req, res) => {
    try {
        const results = db.query("DELETE FROM orders where id = $1;", [
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

// update
// yes just because of this assignment
app.put("/invItem/:id", async (req, res) => {
    try {
        const results = await db.query(
            "UPDATE product SET name = $1, price = $2, description = $3, image = $4, quantity = $5, category_id = $6, sku = $7 where id = $8 returning *;",
            [req.body.name, req.body.price, req.body.description,
            req.params.image, req.params.quantity,
            req.params.category_id, req.params.sku, req.params.id]
        );
        res.status(200).json({
            status: "success",
            data: {
                item: results.rows[0]
            }
        });
    } catch (err) {
        console.log(err);
    }
    console.log(req.params.id);
    console.log(req.body);
});

// updating the cart
// updating info in the cart
app.put("/cart/:id", async (req, res) => {
    try {
        const results = await db.query(
            "UPDATE orders SET userid = $1, orderid = $2, quantity = $3 where id = $4 returning *;",
            [
                req.body.userid, req.body.orderid,
                req.body.quantity, req.body.id
            ]
        );
        res.send(
            {
                status: "success",
                data: {
                    order: results.rows[0]
                }
            }
        )
    } catch (error) {
        console.log(error);
    }
});

// 'add to cart'

app.post("/cart/:id", async (req, res) => {
    try {
        const results = await db.query(`INSERT INTO orders (userid, itemid, quantity, id) values ($1, $2, $3, $4) returning *;`, [
            req.params.userid,
            req.params.itemid,
            req.params.quantity,
            req.params.id
        ]);

        res.status(200).json({
            status: "success",
            data: {
                users: results.rows[0]
            }
        });
    } catch (error) {
        console.log(error);
    }
})

// create a user
app.post("/users", async (req, res) => {
    // getting userdata from table
    // 
    try {
        const send = await db.query(`INSERT INTO users(id, us, ps) values ($1, $2, $3) returning *;`,
            [
                req.body.id,
                req.body.us,
                req.body.ps
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
    const { us, ps } = req.body;
    try {
        const user = await db.query("SELECT * FROM users WHERE us = $1;", [
            us,
            ps
        ]);
        
        if (user.rows.length > 0) {
            return res.status(401).json("User already exists!");
        }

        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(ps, salt);

        let newUser = await db.query(
            "INSERT INTER users (us, ps, cart) VALUES ($1, $2, $3) RETURNING *;",
            [us, bcryptPassword]
        );

        const jwtToken = jwtGenerator(newUser.rows[0].us);
        return res.json({ jwtToken });
    } catch (error) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// create 
app.post("/invItem", async (req, res) => {
    try {
        
        const results = await db.query(`INSERT INTO product(id, name, price, quantity, 
            description, image, category_id, sku) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *;`,
            [
                req.body.id, req.body.name, req.body.price, req.body.quantity,
                req.body.description, req.body.image,
                req.body.category_id, req.body.sku
            ]
        );
        console.log(results);
        res.status(201).json({
            status: "success",
            data: {
                item: results.rows[0]
            }
        });
    } catch (error) {
        console.log(error);
    }
});

// welcome
app.get('/', (req, res) => {
    res.send("hola");
})

// make a table called 'orders' and 'users'.
// orders: with the values productId,
// and make the routes get, post, update and delete

app.get("/users", async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM users;');
        console.log(users);
        res.json(users.rows);
    } catch (error) {
        console.log(error);
    }
});

// getting the right user
app.get('/users/:id', async (req, res) => {
    try {
        const userC = await db.query(`SELECT * FROM users WHERE $1 = ;`, [req.body.id]);
        res.json(userC);
    } catch (error) {
        console.log(error);
    }
});

// grabbing one users stuff.
app.get('/orders/stuff/:userid', async (req, res) => {
    try {
        const orders = await db.query(`SELECT * FROM orders WHERE userid = ;`, [req.body.userid]);
        console.log(orders);
        res.status(200).json({
            status: "success",
            data: {
                order: results.rows[0]
            }
        });
        res.json(orders.rows);
    } catch (error) {
        console.log(error);
    }
});

//order id
app.get('/orders/:id', async (req, res) => {
    try {
        const orders =
            await db.query(`SELECT * FROM orders WHERE id = $1;`,
                [req.body.id]);
        console.log(orders);
        res.status(200).json({
            status: "success",
            data: {
                order: results.rows[0]
            }
        });
        res.json(orders.rows);
    } catch (error) {
        console.log(error);
    }
});

app.get("/invItem", async(req, res)=>
{
    res.send('Context');
})

app.get("/THANKS", async (req, res) => {
    res.send("Arigato.")
});

// GET ALL\ items
app.get("/invItem/getAll", async (req, res) => {
    try {
        const itemas = await db.query('SELECT * FROM product;');
        console.log(itemas);
        res.json(itemas.rows);
    } catch (error) {
        console.log(error);
    }
});

// Get one specific item
// show
app.get("/invItem/show/:id", async (req, res) => {
    console.log(req.body);
    try {
        const results =
            await db.query(`SELECT * FROM product WHERE id = $1;`,
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