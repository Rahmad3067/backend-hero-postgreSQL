const express = require('express');
const debug = require('./middlewares/debug')
const app = express();
const dotenv = require("dotenv");
const { Pool } = require("pg");
dotenv.config({
    path: "./config.env"
});

// Connecting to Postgres Databse
const Postgres = new Pool({ ssl: {rejectUnauthorized: false} });
app.use(express.json());
app.use(debug);

// Adding new powers to the table power in POSTGRESQL
app.post("/power", async ( req, res ) => {
    const newpowers = req.body.powers
    console.log(req.body)
    console.log(newpowers)
    try {
        await Postgres.query("INSERT INTO power(powers) VALUES($1)", [
            newpowers
        ]);
        return res.status(201).json({
            message: "success"
        })
    } catch (err) {
        console.log(err)
        
        return res.status(400).json({
            message:"An error happened..."
        })
    }
})

// Here we add our heroes to superheroes table in PostgreSQL
app.post("/heroes", async (req, res) => {
    const heroes = req.body
    try{
        await Postgres.query("INSERT INTO superheroes(name, color, is_alive, age, image) VALUES($1, $2, $3, $4, $5)", [
            heroes.name,
            heroes.color,
            heroes.is_alive,
            heroes.age,
            heroes.image
        ]);
        return res.status(201).json({
            message:"Successful"
        });

    } catch (err) {
        return res.status(400).json({
            message: "An error happened...",
        })
    }
});

// Here with this request we can see the list of all the heroes 
app.get("/", async ( req, res ) => {
    let heros;
    try {
        heros = await Postgres.query("SELECT * FROM superheroes");
    } catch (err) {
        return res.status(400).json({
            message:"An error happened...",
        });
    }
    res.json({
        message: "success",
        data: heros.rows,
    })
});

// In this part we add a new table in PostgreSQL and give new id for each hero so we can combine from table of powers and heroes
app.post("/heroespower", async ( req, res ) => {
    const heropower = req.body
    try{
        await Postgres.query("INSERT INTO heroespower(heroesID, powerID) VALUES($1, $2)", [
            heropower.heroesID,
            heropower.powerID
        ]);
        return res.status(201).json({
            message: "success"
        })

    } catch (err) {
        return res.status(400).json({
            message: "An erro happened..."
        })
    }
})

// here we do a request so we can see all the heroes with their powers together
app.get("/herolist", async ( req, res ) => {
    let newHeroList;
    try{
        newHeroList = await Postgres.query(`SELECT * FROM superheroes INNER JOIN heroespower ON heroespower.heroesID = superheroes.id 
        INNER JOIN power ON heroespower.powerID = superheroes.id`);
        return res.status(201).json({
            message: "Success",
            data: newHeroList.rows,
        })
    } catch (err) {
        return res.status(400).json({
            message:"An error happened..."
        });
        
    }
})

// Here we can find a hero in the list with typing the name of hero in the Postman
app.get("/heroes/:name", async ( req, res ) =>{
    const heroId = req.params.name;
    let hero;
    try {
        hero = await Postgres.query("SELECT * FROM superheroes WHERE name=$1", [
            heroId,
        ]);
        return res.status(201).json({
            message:"Success",
            data: hero.rows,
        })
    } catch (err) {
        return res.status(400).json({
            message: "An error happened...",
        })
    }
});


// Here we can add the name of hero with this request so same time we can type the name of hero and see the the power of that hero
app.get("/heroes/:name/power", async ( req, res ) =>{
    const heroId = req.params.name;
    let hero;
    try {
        hero = await Postgres.query(`SELECT superheroes.name,power.powers FROM power INNER JOIN heroespower ON heroespower.powerID =  power.id
        INNER JOIN superheroes ON superheroes.id = heroespower.heroesID WHERE name=$1`, [
            heroId,
        ]);
        return res.status(201).json({
            message:"Success",
            data: hero.rows,
        })
    } catch (err) {
        return res.status(400).json({
            message: "An error happened...",
        })
    }
})



// app.get("/heroes/:name", async (req, res) => {
//     const superHeros = await SuperHeros.find();
//     let param = req.params.name;
//     const newHeroes = superHeros.filter((hero) =>
//         hero.name.toLocaleLowerCase().replace(' ','') === param.toLocaleLowerCase());
//     res.json({
//         message: "Hero by the name...",
//         data: newHeroes,
//     })
// });
// app.get("/heroes/:name/power", async (req, res) => {
//     const superHeros = await SuperHeros.find();
//     let param = req.params.name;
//     const hero = superHeros.find((obj) => obj.name.toLocaleLowerCase().replace(' ', "")=== param.toLocaleLowerCase());

//     res.json({
//     status: 'Ok',
//     data: hero.power
// })
// })


// app.patch("/heroes/:name/powers", async(req, res) => {
//     const name = req.params.name;
//     const newPower = req.body.newPower
    // Here we call our array and then updateOne to only update the matching filter
    // await SuperHeros.updateOne(
        //Then we add power by a condition that if name we enter is the name we looking for and then we update and add a new power
//         {name : name },
//         // Then we use this Method to add the new Power in the place of the power
//         { $push: { power: newPower } }
//      )
//     res.json({
//         status: "Ok",
//         message: "Power added !",
//         data: newPower
//     })
// })






app.listen(3000, () => console.log("Listening"))
