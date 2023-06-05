/*Ver todos los productos*/
select * from Productos;

/*Ver un producto en específico*/
select
    *
from
    Productos
where
    id = 1;

/*Crear un nuevo producto*/
insert into Productos (nombre,precioCompra,precioVenta,existencia) values ("Colores Mapita", 40, 50, 20);

/*Actualizar Producto*/
update Productos set nombre = "Colores Fabber Casttle" where  id = 1;

/*Eliminar Producto*/
delete from
    Productos
where
    id = 1;

/*Ver el historial de precios*/
select
    *
from
    Historial;

/*Nuevo registro de precio*/
insert into
    Historial (
        idProducto,
        fecha,
        precioCompraViejo,
        precioCompraNuevo,
        precioVentaViejo,
        precioVentaNuevo
    )
values
(
        (
            select
                id
            from
                Productos
            where
                nombre = "Colores Mapita"
        ),
        "02/04/2022",
        (
            select
                precioCompra
            from
                Productos
            where
                nombre = "Colores Mapita"
        ),
        30,
        (
            select
                precioVenta
            from
                Productos
            where
                nombre = "Colores Mapita"
        ),
        50
    );

/*Ver el Historial de un Producto*/
select
    *
from
    Historial
where
    idProducto = 4;