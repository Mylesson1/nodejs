const express = require('express');
const path = require('path');
const nodeMailer = require('nodemailer');
const bodyParser = require('body-parser');
const fs = require('fs');
const md5 = require('crypto');
const Sequelize = require('sequelize');
const jwt = require("jsonwebtoken");
const Op = Sequelize.Op;
const app = express();
const port = 3400;

const connection = new Sequelize('freelancer', 'my_db_name_1', '12345', {
    name:'hayko',
    host: 'localhost',
    dialect: 'mysql',
    pool: { max: 5, min: 0, idle: 3400 },
});

app.use(bodyParser());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



const Users = connection.define("users", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, },
    firstname: { type: Sequelize.STRING, allowNull: false },
    lastname: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
});




const Products = connection.define("products", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, },
    title: { type: Sequelize.STRING, allowNull: false },
    image: { type: Sequelize.STRING, allowNull: false },
    price: { type: Sequelize.INTEGER },
    currency: { type: Sequelize.STRING, allowNull: false },
    category: { type: Sequelize.INTEGER },
    subCategory: { type: Sequelize.INTEGER },
    description: { type: Sequelize.STRING, allowNull: false },
});

const Images = connection.define("images", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, },
    image: { type: Sequelize.STRING, allowNull: false },
});


const Navbars = connection.define("navbars", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, },
    title: { type: Sequelize.STRING, allowNull: false },
});

const Sub = connection.define("sub", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, },
    title: { type: Sequelize.STRING, allowNull: false },
});

Navbars.hasMany(Sub);
Products.hasMany(Images);



connection.sync();

app.get('/api/navbars', (req, res) => {
    Navbars.findAll({ include: [Sub] }).then(navbars => {
        res.json(navbars);
    }).catch((error) => {
        res.json({ error: true, message: error.message })
    })
});


app.get('/api/products/page/:page/limit/:limit', (req, res) => {

    let ssssssssss = {
        offset: Number(req.params.limit) * Number(req.params.page) - Number(req.params.limit) < 0 ? 0 : Number(req.params.limit) * Number(req.params.page) - Number(req.params.limit),
        limit: Number(req.params.limit)

    }
    Products.findAll(ssssssssss).then(products => {
        res.json(products);
    }).catch((error) => {
        res.json({ error: true, message: error.message })
    })
    console.log(req.body)

});

app.post('/api/products-count', (req, res) => {

    Products.findAll().then(products => {
        res.json(products.length);
    }).catch((error) => {
        res.json({ error: true, message: error.message })
    })
});

app.post('/api/products-id', (req, res) => {
    let idd = parseInt(req.body.id);
    Products.findAll({
        where: {
            subCategory: idd
        },
        offset: req.body.count,
        limit: req.body.limit

    }).then(products => {
        res.json(products);
    }).catch((error) => {
        res.json({ error: true, message: error.message })
    })
});


app.get('/api/users', (req, res) => {
    Users.findAll().then(users => {
        res.json(users);
    }).catch((error) => {
        res.json({ error: true, message: error.message })
    })
});


app.post('/insert/user', (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let passwords = req.body.password;
    let pass = md5.createHash('md5').update(passwords).digest('hex');

    return Users.create({
        id: null,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: pass
    }).then((usersss) => {
        if (usersss) {
            res.json(usersss);
        } else {
            res.status(400).json({ error: true, message: error.message });
        }
    }).catch((error) => {
        res.json({ error: true, message: error.message })
    });
});




app.get('/api/product-item/:id', (req, res) => {
    let ids = req.params.id;
    Products.findOne({ include: [Images], where: { id: ids } }).then(products => {
        res.json(products);
    }).catch((error) => {
        res.json({ error: true, message: error.message })
    })
});




app.use('/', express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/item/:id', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/category/:id', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/sub/:id', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/sign-up', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/sign-in', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// app.post('/insert', (req, res) => {

//     let email = req.body.email;
//     let passwords = req.body.password;
//     let pass = md5.createHash('md5').update(passwords).digest('hex');

//     return Users.create({
//         id: req.body.id,
//         name: 'name',
//         image: 'default.png',
//         description: 'full text...',
//         karoxutyun: 'karoxutyun...',
//         categories: 'Browse-Jobs',
//         password: pass,
//         email: email,
//         family_status: '...',
//         preferred_palary: '...',
//         working_schedule: '...',
//         education: '...',
//         educational_institution: '...',
//         preferred_position: '...',
//         knowledge_of_languages: '...',
//         work_experience_and_practice: '...',
//         hobbies_hobbies: '...',
//         preferred_job: '...',
//         computer_skills: '...',
//         add_portfolio: '...',
//         ser: '...',
//         taracashrjan: '...',
//     }).then((usersss) => {
//         if (usersss) {
//             res.json(usersss);
//         } else {
//             res.status(400).json({ error: true, message: error.message });
//         }
//     }).catch((error) => {
//         res.json({ error: true, message: error.message})
//     });


// });



app.listen(port, () => {
    console.log(`miacelenq ${port} portin`);
});
