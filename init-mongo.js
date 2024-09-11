db = db.getSiblingDB('Tienda');

// Crear colecciones si no existen
if (!db.getCollectionNames().includes('Productos')) {
    db.createCollection('Productos');
    db.Productos.createIndex({ nombre_producto: 1 }, { unique: true });
}

if (!db.getCollectionNames().includes('Categoria')) {
    db.createCollection('Categoria');
    db.Categoria.createIndex({ nombre_categoria: 1 }, { unique: true });
}

if (!db.getCollectionNames().includes('Clientes')) {
    db.createCollection('Clientes');
    db.Clientes.createIndex({ DNI_cliente: 1 }, { unique: true });
}

// Estructura de ejemplo para Productos
db.Productos.insertMany([
    {
        nombre_producto: "Producto de Ejemplo 1",
        descripcion: "Descripción de ejemplo 1",
        precio_venta: 100,
        miniatura: "url-de-miniatura-1"
    },
    {
        nombre_producto: "Producto de Ejemplo 2",
        descripcion: "Descripción de ejemplo 2",
        precio_venta: 200,
        miniatura: "url-de-miniatura-2"
    }
]);

// Estructura de ejemplo para Categoria
db.Categoria.insertMany([
    {
        nombre_categoria: "Categoría de Ejemplo 1",
        descripcion: "Descripción de la categoría de ejemplo 1"
    },
    {
        nombre_categoria: "Categoría de Ejemplo 2",
        descripcion: "Descripción de la categoría de ejemplo 2"
    }
]);

// Estructura de ejemplo para Clientes
db.Clientes.insertMany([
    {
        nombre: "Cliente de Ejemplo 1",
        DNI_cliente: "12.345.678",
        username: "cliente1",
        email: "cliente1@example.com"
    },
    {
        nombre: "Cliente de Ejemplo 2",
        DNI_cliente: "23.456.789",
        username: "cliente2",
        email: "cliente2@example.com"
    }
]);
