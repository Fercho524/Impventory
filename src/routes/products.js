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

    await pool.query('INSERT INTO Productos set ?', [newProduct]);

    req.flash('success', 'Producto guardado correctamente');
    res.redirect('/products');
});


// Borrar
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query("SET FOREIGN_KEY_CHECKS=0")
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

    const productoViejo = await pool.query("select * from Productos where id=?", [id])[0];

    const { nombre, descripcion, precioVenta, precioCompra, existencia } = req.body;
    const newProduct = {
        nombre, descripcion, precioVenta, precioCompra, existencia
    };

    const precioCompraViejo=0;
    const precioCompraNuevo=precioCompra;
    const precioVentaViejo=0;
    const precioVentaNuevo=precioVenta;

    const registro = {
        idProducto: id,
        fecha: new Date,
        precioCompraViejo,
        precioCompraNuevo,
        precioVentaViejo,
        precioVentaNuevo
    }

    await pool.query('UPDATE Productos set ? WHERE id = ?', [newProduct, id]);
    await pool.query(`insert into Historial set ?`,[registro]);

    req.flash('success', 'Producto editado correctamente');
    res.redirect('/products');
});

router.get("/history/:id", async (req, res) => {
    const { id } = req.params;
    const prices = await pool.query('SELECT * FROM Historial where idProducto= ?', [id]);
    res.render("products/history", { prices });
})

module.exports = router;