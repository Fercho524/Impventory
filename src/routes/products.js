// Rutas de Productos

const express = require('express');

const router = express.Router();

const pool = require('../database');

const momment = require("momment");

// Productos
router.get('/', async (req, res) => {
    const products = await pool.query("select * from Productos");
    res.render("products/list", { products })
});

// Añadir Producto
router.get('/add', (req, res) => {
    res.render("products/add")
});

router.post('/add', async (req, res) => {
    const { nombre, descripcion, existencia, precioCompra, precioVenta } = req.body;
    const newProduct = {
        nombre,
        descripcion,
        existencia,
        precioCompra,
        precioVenta
    };

    console.log(nombre, descripcion, existencia, precioCompra, precioVenta)

    await pool.query(`insert into Productos (nombre,precioCompra,precioVenta,existencia) values ("${nombre}", ${precioCompra}, ${precioVenta}, ${existencia});`);

    const producto = await pool.query("SELECT * FROM Productos WHERE nombre=?", [nombre]);
    const newId = producto[0].id;

    const precioCompraViejo = 0;
    const precioCompraNuevo = precioCompra;
    const precioVentaViejo = 0;
    const precioVentaNuevo = precioVenta;

    const registro = {
        idProducto: newId,
        fecha: new Date,
        precioCompraViejo,
        precioCompraNuevo,
        precioVentaViejo,
        precioVentaNuevo
    }
    await pool.query(`insert into Historial set ?`, [registro]);


    req.flash('success', 'Producto guardado correctamente');
    res.redirect('/products');
});


// Borrar
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query("SET FOREIGN_KEY_CHECKS=0");
    await pool.query('DELETE FROM Productos WHERE ID = ?', [id]);
    req.flash('success', 'Producto eliminado correctamente');
    res.redirect('/products');
});

// Vista para editar mi producto
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const productos = await pool.query('SELECT * FROM Productos WHERE id = ?', [id]);
    res.render('products/edit', { producto: productos[0] });
});

// Actualizar
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;

    const productoViejo = await pool.query("select * from Productos where id=?", [id]);

    const { nombre, descripcion, precioVenta, precioCompra, existencia } = req.body;
    
    const newProduct = {
        nombre, descripcion, precioVenta, precioCompra, existencia
    };

    const precioCompraViejo = productoViejo[0].precioCompra;
    const precioCompraNuevo = precioCompra;
    const precioVentaViejo = productoViejo[0].precioVenta;
    const precioVentaNuevo = precioVenta;

    if (precioCompraViejo!=precioCompraNuevo || precioVentaViejo!=precioVentaNuevo) {
        const registro = {
            idProducto: id,
            fecha: new Date,
            precioCompraViejo,
            precioCompraNuevo,
            precioVentaViejo,
            precioVentaNuevo
        }
        await pool.query(`insert into Historial set ?`, [registro]);
    }

    await pool.query('UPDATE Productos set ? WHERE id = ?', [newProduct, id]);

    req.flash('success', 'Producto editado correctamente');
    res.redirect('/products');
});

router.get("/history/:id", async (req, res) => {
    const { id } = req.params;
    const prices = await pool.query('SELECT * FROM Historial where idProducto= ?', [id]);
    res.render("products/history", { prices });
})


router.get("/addCar/:id",async(req,res)=>{
    const id=req.params.id;
    const producto=await pool.query("SELECT * FROM Productos where id=?",[id]);
    console.log(producto)
    res.render('products/addCar',{producto:producto[0]});
})


router.post("/addCar/:id",async(req,res)=>{
    const id=req.params.id;
    const {existencia}=req.body;
    const producto=await pool.query("SELECT * FROM Productos where id=?",[id]);
    
    //const restantes=parseInt(producto[0].existencia)-parseInt(existencia);
    
    await pool.query("INSERT INTO Carrito (nombre,cantidad,precio) values(?,?,?)",[
        producto[0].nombre,
        existencia,
        producto[0].precioVenta
    ])
    
    req.flash('success', 'Producto añadido al carrito');
    //await pool.query("UPDATE Productos set existencia=? where id=?",[restantes,id]);
    
    res.redirect('/products/car');
})

router.get("/car",async(req,res)=>{
    const car=await pool.query("SELECT * FROM Carrito");
    res.render("products/car",{car})
});

router.get("/carDelete/:id",async(req,res)=>{
    const {id}=req.params;

    await pool.query("SET FOREIGN_KEY_CHECKS=0");
    await pool.query("DELETE FROM Carrito where id=?",[id]);

    req.flash('success', 'Producto eliminado del carrito');
    res.redirect("/products/car")
})

router.get("/genorder",async(req,res)=>{
    const car=await pool.query("SELECT * FROM Carrito");

    let i=0;
    while(car[i]){
        console.log(car[i]);
        const {nombre,precio,cantidad}=car[i];
        const producto=await pool.query("SELECT * FROM Productos where nombre = ?",[nombre]);

        const restantes=producto[0].existencia-cantidad;
        await pool.query("INSERT INTO Ventas (nombre,precio,cantidad) values (?,?,?)",[
            nombre,
            precio,
            cantidad
        ]);

        await pool.query("UPDATE Productos set existencia=? where nombre=?",[restantes,nombre]);
        i++;
    }

    const ventas=await pool.query("SELECT * FROM Ventas");
    
    await pool.query("SET FOREIGN_KEY_CHECKS=0");
    await pool.query("DELETE FROM Carrito where cantidad>0");

    res.render("products/genorder",{ventas})
})

module.exports = router;