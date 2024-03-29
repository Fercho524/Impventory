/*PRODUCTOS*/

CREATE TABLE Productos (
    id INT NOT NULL PRIMARY KEY DEFAULT 1,
    nombre CHAR(255) NOT NULL DEFAULT 'Prueba',
    precioCompra DECIMAL NOT NULL DEFAULT 0,
    precioVenta DECIMAL NOT NULL DEFAULT 0,
    existencia INT DEFAULT 0,
    descripcion CHAR(255) DEFAULT ''
);

ALTER TABLE
    Productos
MODIFY
    id INT NOT NULL AUTO_INCREMENT,
    AUTO_INCREMENT = 1;

DESCRIBE Productos;

/*CARRITO*/

CREATE TABLE Carrito (
    id INT NOT NULL PRIMARY KEY DEFAULT 1,
    nombre CHAR(255) NOT NULL DEFAULT 'Prueba',
    cantidad INT NOT NULL DEFAULT 1,
    precio INT DEFAULT 0
);

ALTER TABLE Carrito
MODIFY
    id INT NOT NULL AUTO_INCREMENT,
    AUTO_INCREMENT = 1;

DESCRIBE Carrito;

/*HISTORIAL DE PRECIOS*/

CREATE TABLE Historial (
    id INT NOT NULL PRIMARY KEY,
    idProducto int not null,
    FOREIGN KEY (idProducto) REFERENCES Productos (id),
    fecha VARCHAR(255) NOT NULL DEFAULT '00/00/00',
    precioCompraViejo DECIMAL NOT NULL DEFAULT 0,
    precioCompraNuevo DECIMAL NOT NULL DEFAULT 0,
    precioVentaViejo DECIMAL NOT NULL DEFAULT 0,
    precioVentaNuevo DECIMAL NOT NULL DEFAULT 0
);

ALTER TABLE
    Historial
MODIFY
    id INT NOT NULL AUTO_INCREMENT,
    AUTO_INCREMENT = 1;

DESCRIBE Historial;

/*VENTAS*/

CREATE TABLE Ventas (
    nombre CHAR(255),
    precio FLOAT DEFAULT 0,
    cantidad INT DEFAULT 0
)

/*OPERACIONES*/

CREATE TABLE Operaciones (
    id INT NOT NULL PRIMARY KEY,
    nombre CHAR(255),
    idProducto int not null,
    FOREIGN KEY (idProducto) REFERENCES Productos (id),
    cantidad INT DEFAULT 1,
    precioUnitario DECIMAL DEFAULT 0
);

ALTER TABLE
    Operaciones
MODIFY
    id INT NOT NULL AUTO_INCREMENT,
    AUTO_INCREMENT = 1;

DESCRIBE Operaciones;