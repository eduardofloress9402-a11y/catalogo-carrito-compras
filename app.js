// Lista de productos del catálogo
const productos = [
  { id: 1, nombre: 'Lomito Completo Cordobés', precio: 8500 },
  { id: 2, nombre: 'Cerveza Artesanal IPA 500ml', precio: 3200 },
  { id: 3, nombre: 'Pizza Especial de la Casa', precio: 9800 },
  { id: 4, nombre: 'Empanada Criolla (Unidad)', precio: 1100 }
];

// Estado del carrito (se carga desde localStorage si existe)
let carrito = JSON.parse(localStorage.getItem('carrito_compras')) || [];

// Elementos del DOM
const contenedorProductos = document.getElementById('contenedor-productos');
const listaCarrito = document.getElementById('lista-carrito');
const precioTotal = document.getElementById('precio-total');

// Renderizar el catálogo de productos
function renderizarProductos() {
  if (!contenedorProductos) return;
  contenedorProductos.innerHTML = '';

  productos.forEach(producto => {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta-producto');
    tarjeta.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p class="precio">$${producto.precio.toLocaleString('es-AR')}</p>
      <button onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
    `;
    contenedorProductos.appendChild(tarjeta);
  });
}

// Agregar producto al carrito
function agregarAlCarrito(idProducto) {
  const producto = productos.find(p => p.id === idProducto);
  if (!producto) return;

  const itemExistente = carrito.find(item => item.id === idProducto);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarYActualizar();
}

// Eliminar producto del carrito
function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter(item => item.id !== idProducto);
  guardarYActualizar();
}

// Renderizar lista del carrito y total
function renderizarCarrito() {
  if (!listaCarrito || !precioTotal) return;
  listaCarrito.innerHTML = '';

  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<p>El carrito está vacío.</p>';
    precioTotal.textContent = '0';
    return;
  }

  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const divItem = document.createElement('div');
    divItem.classList.add('item-carrito');
    divItem.innerHTML = `
      <div>
        <strong>${item.nombre}</strong><br>
        <small>$${item.precio.toLocaleString('es-AR')} x ${item.cantidad}</small>
      </div>
      <div>
        <span>$${subtotal.toLocaleString('es-AR')}</span>
        <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">X</button>
      </div>
    `;
    listaCarrito.appendChild(divItem);
  });

  precioTotal.textContent = total.toLocaleString('es-AR');
}

// Guardar en localStorage y actualizar pantalla
function guardarYActualizar() {
  localStorage.setItem('carrito_compras', JSON.stringify(carrito));
  renderizarCarrito();
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  renderizarProductos();
  renderizarCarrito();
});
