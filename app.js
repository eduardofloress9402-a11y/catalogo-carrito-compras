const productos = [
    { 
        id: 1, 
        nombre: "Lomito Completo Cordobés", 
        precio: 8500, 
        imagen: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80" 
    },
    { 
        id: 2, 
        nombre: "Empanada Criolla (Unidad)", 
        precio: 1100, 
        imagen: "https://images.unsplash.com/photo-1628102491629-778571d893a3?w=400&q=80" 
    },
    { 
        id: 3, 
        nombre: "Pizza Especial de la Casa", 
        precio: 9800, 
        imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80" 
    },
    { 
        id: 4, 
        nombre: "Hamburguesa Doble con Queso", 
        precio: 7900, 
        imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" 
    },
    { 
        id: 5, 
        nombre: "Papas Cheddar y Bacon", 
        precio: 4500, 
        imagen: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=400&q=80" 
    },
    { 
        id: 6, 
        nombre: "Cerveza Artesanal IPA 500ml", 
        precio: 3200, 
        imagen: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80" 
    },
    { 
        id: 7, 
        nombre: "Fernet preparado 750ml", 
        precio: 4200, 
        imagen: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80" 
    },
    { 
        id: 8, 
        nombre: "Gaseosa Cola 500ml", 
        precio: 1800, 
        imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" 
    }
];

let carrito = [];
let medioPagoSeleccionado = "Mercado Pago";
const NUMERO_WHATSAPP = "5493510000000"; // Pon tu teléfono aquí

const contenedorProductos = document.getElementById("contenedor-productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");

function renderizarProductos() {
    contenedorProductos.innerHTML = "";
    productos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("producto-card");
        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width:100%; height:140px; object-fit:cover; border-radius:8px; margin-bottom:12px;">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio.toLocaleString()}</p>
            <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        contenedorProductos.appendChild(tarjeta);
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const item = carrito.find(p => p.id === id);

    if (item) {
        item.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    renderizarCarrito();
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(p => p.id === id);
    if (!item) return;

    item.cantidad += cambio;
    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.id !== id);
    }
    renderizarCarrito();
}

function seleccionarMedioPago(metodo) {
    medioPagoSeleccionado = metodo;
}

function renderizarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        totalCarrito.innerText = "$0";
        return;
    }

    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const divItem = document.createElement("div");
        divItem.classList.add("item-carrito");
        divItem.innerHTML = `
            <div class="item-info">
                <strong>${item.nombre}</strong>
                <span style="color:#94a3b8; font-size:0.85rem;">$${item.precio.toLocaleString()} c/u</span>
            </div>
            <div class="item-controles">
                <button class="btn-qty" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-qty" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                <strong style="margin-left:8px;">$${subtotal.toLocaleString()}</strong>
            </div>
        `;
        listaCarrito.appendChild(divItem);
    });

    // Sección de Medios de Pago
    const divPago = document.createElement("div");
    divPago.classList.add("pago-seccion");
    divPago.innerHTML = `
        <h4>Medio de Pago:</h4>
        <label class="pago-opcion">
            <input type="radio" name="pago" value="Mercado Pago" checked onclick="seleccionarMedioPago('Mercado Pago')"> Mercado Pago / Transferencia
        </label>
        <label class="pago-opcion">
            <input type="radio" name="pago" value="Efectivo" onclick="seleccionarMedioPago('Efectivo')"> Efectivo al retirar/recibir
        </label>
    `;
    listaCarrito.appendChild(divPago);

    totalCarrito.innerText = `$${total.toLocaleString()}`;

    // Botón de Confirmar y Enviar Pedido
    const btnConfirmar = document.createElement("button");
    btnConfirmar.classList.add("btn-pago");
    btnConfirmar.innerText = "Confirmar y Pagar 📲";
    btnConfirmar.onclick = enviarPedidoWhatsApp;

    listaCarrito.appendChild(btnConfirmar);
}

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) return;

    let total = 0;
    let mensaje = "¡Hola! Quisiera realizar el siguiente pedido:%0A%0A";

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `• ${item.cantidad}x ${item.nombre} = $${subtotal.toLocaleString()}%0A`;
    });

    mensaje += `%0A*Total a Pagar:* $${total.toLocaleString()}`;
    mensaje += `%0A*Medio de Pago:* ${medioPagoSeleccionado}`;

    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`;
    window.open(url, "_blank");
}

renderizarProductos();
