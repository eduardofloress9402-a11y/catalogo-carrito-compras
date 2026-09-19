const productos = [
    { 
        id: 1, 
        nombre: "Lomito Completo Cordobés", 
        precio: 8500, 
        imagen: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400" 
    },
    { 
        id: 2, 
        nombre: "Empanada Criolla (Unidad)", 
        precio: 1100, 
        imagen: "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=400" 
    },
    { 
        id: 3, 
        nombre: "Pizza Especial de la Casa", 
        precio: 9800, 
        imagen: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400" 
    },
    { 
        id: 4, 
        nombre: "Hamburguesa Doble con Queso", 
        precio: 7900, 
        imagen: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400" 
    },
    { 
        id: 5, 
        nombre: "Papas Cheddar y Bacon", 
        precio: 4500, 
        imagen: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400" 
    },
    { 
        id: 6, 
        nombre: "Cerveza Artesanal IPA 500ml", 
        precio: 3200, 
        imagen: "https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400" 
    },
    { 
        id: 7, 
        nombre: "Fernet preparado 750ml", 
        precio: 4200, 
        imagen: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400" 
    },
    { 
        id: 8, 
        nombre: "Gaseosa Cola 500ml", 
        precio: 1800, 
        imagen: "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400" 
    }
];

let carrito = [];
let medioPagoSeleccionado = "Mercado Pago";
const NUMERO_WHATSAPP = "5493510000000";

const contenedorProductos = document.getElementById("contenedor-productos");
const listaCarrito = document.getElementById("lista-carrito");
const elementoTotal = document.getElementById("total");

function renderizarProductos() {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = "";
    productos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("producto-card");
        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio.toLocaleString('es-AR')}</p>
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
    if (!listaCarrito) return;
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p style='color:#94a3b8; padding: 10px 0;'>El carrito está vacío.</p>";
        if (elementoTotal) elementoTotal.innerText = "Total: $0";
        return;
    }

    let totalCalculado = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalCalculado += subtotal;

        const divItem = document.createElement("div");
        divItem.classList.add("item-carrito");
        divItem.innerHTML = `
            <div>
                <strong>${item.nombre}</strong>
                <span style="color:#94a3b8; font-size:0.85rem; display:block;">$${item.precio.toLocaleString('es-AR')} c/u</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <button class="btn-qty" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-qty" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                <strong style="margin-left:8px;">$${subtotal.toLocaleString('es-AR')}</strong>
            </div>
        `;
        listaCarrito.appendChild(divItem);
    });

    if (elementoTotal) {
        elementoTotal.innerText = `Total: $${totalCalculado.toLocaleString('es-AR')}`;
    }

    const divPago = document.createElement("div");
    divPago.style.cssText = "margin-top:15px; padding-top:10px; border-top:1px solid #334155;";
    divPago.innerHTML = `
        <h4 style="margin-bottom:8px; color:#cbd5e1;">Medio de Pago:</h4>
        <label style="display:block; margin-bottom:6px; cursor:pointer;">
            <input type="radio" name="pago" value="Mercado Pago" checked onclick="seleccionarMedioPago('Mercado Pago')"> Mercado Pago / Transferencia
        </label>
        <label style="display:block; margin-bottom:15px; cursor:pointer;">
            <input type="radio" name="pago" value="Efectivo" onclick="seleccionarMedioPago('Efectivo')"> Efectivo
        </label>
    `;
    listaCarrito.appendChild(divPago);

    const btnPagar = document.createElement("button");
    btnPagar.style.cssText = "display:block; width:100%; background:#22c55e; color:white; padding:12px; border-radius:8px; font-weight:bold; font-size:1rem; border:none; cursor:pointer; margin-top:10px;";
    btnPagar.innerText = "PAGAR Y ENVIAR PEDIDO 📲";
    btnPagar.onclick = enviarPedidoWhatsApp;

    listaCarrito.appendChild(btnPagar);
}

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) return;

    let total = 0;
    let mensaje = "¡Hola! Quisiera realizar el siguiente pedido:%0A%0A";

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `• ${item.cantidad}x ${item.nombre} = $${subtotal.toLocaleString('es-AR')}%0A`;
    });

    mensaje += `%0A*Total a Pagar:* $${total.toLocaleString('es-AR')}`;
    mensaje += `%0A*Medio de Pago:* ${medioPagoSeleccionado}`;

    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`;
    window.open(url, "_blank");
}

renderizarProductos();
