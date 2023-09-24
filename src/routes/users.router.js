const express = require('express');
const router = express.Router();
const usuario = require('../models/User');
const {isValidatePassword } = require('../../utils');
const productos = require('../models/Product');
const passport = require("passport")
const bcrypt = require('bcrypt');


router.get("/login", async (req, res) => {
    res.render("login")
})

router.get("/register", async (req, res) => {
    res.render("register")
})


router.get("/producto", async (req, res) => {
    if (!req.session.user ) {
        return res.redirect("login")
    }
    const { first_name, last_name, email, age, isAdmin} = req.session.user

    try {
       
        const products= await productos.find();
        const productsWithOwnProperties = products.map(producto => {
            return {
                nombre: producto.nombre,
                precio: producto.precio
            };
        });
        
        res.render("producto", { first_name, last_name, age, email, isAdmin, products: productsWithOwnProperties });
        
    } catch (error) {
        console.error("Error al obtener productos:", error);
        
    }
    
})

router.get("/admin", async (req, res) => {
    if (!req.session.products) {
        return res.redirect("login")
    }

    const { first_name, last_name, email, age, isAdmin} = req.session.user

    try {
       
        const products= await productos.find();
        const productsWithOwnProperties = products.map(producto => {
            return {
                nombre: producto.nombre,
                precio: producto.precio,
                stock: producto.stock
            };
        });
        
        res.render("admin", { first_name, last_name, age, email, isAdmin, products: productsWithOwnProperties });
        
    } catch (error) {
        console.error("Error al obtener productos:", error);
        
    }
    
})

router.get("/logout", async (req, res) => {
    delete req.session.user
    res.redirect("/api/sessions/login")
})


router.post('/register', passport.authenticate("register", { failureRedirect: "/failregister" }), async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await usuario.create({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword
    });

    console.log('Usuario registrado con éxito.' + user);
    res.redirect('login');
});


router.get("/failregister", async (req, res) => {
    console.log("Falla en autenticacion")
    res.send({ error: "Falla" })
})


router.get("/faillogin", async (req, res) => {
    console.log("Falla en autenticacion")
    res.send({ error: "Falla" })
})


router.post("/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {

const { email, password } = req.body;
    if (!email || !password) return res.status(400).render("login", { error: "Valores erroneos" });

    const user = await usuario.findOne({ email }, { first_name: 1, last_name: 1, age: 1, password: 1, email: 1 , isAdmin: 1 });
        let products= await productos.find()
        req.session.products = products
        console.log (products)
    if (!user) {
        return res.status(400).render("login", { error: "Usuario no encontrado" });
    }

    if (!isValidatePassword(user.password, password)) {
        return res.status(401).render("login", { error: "Error en password" });
    }
    console.log (user)
    
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    }

     
    if (user.isAdmin == false) {
        res.redirect("/api/sessions/producto");
    } else {
        res.redirect("/api/sessions/admin");
        
    }
    
}
)

module.exports = router;