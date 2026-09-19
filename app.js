const productos = [
    { 
        id: 1, 
        nombre: "Lomito Completo Cordobés", 
        precio: 8500, 
        imagen: "https://upload.wikimedia.org/wikipedia/commons/4/48/Sandwich_de_lomito.jpg" 
    },
    { 
        id: 2, 
        nombre: "Empanada Criolla (Unidad)", 
        precio: 1100, 
        imagen: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Empanada_salte%C3%B1a_2.jpg" 
    },
    { 
        id: 3, 
        nombre: "Pizza Especial de la Casa", 
        precio: 9800, 
        imagen: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg" 
    },
    { 
        id: 4, 
        nombre: "Hamburguesa Doble con Queso", 
        precio: 7900, 
        imagen: "https://upload.wikimedia.org/wikipedia/commons/0/0b/RedDot_Burger.jpg" 
    },
    { 
        id: 5, 
        nombre: "Papas Cheddar y Bacon", 
        precio: 4500, 
        imagen: "https://upload.wikimedia.org/wikipedia/commons/6/67/Fries_2.jpg" 
    },
    { 
        id: 6, 
        nombre: "Cerveza Artesanal IPA 500ml", 
        precio: 3200, 
        imagen: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Glass_of_lager_beer.jpg" 
    },
    { 
        id: 7, 
        nombre: "Fernet preparado 750ml", 
        precio: 4200, 
        imagen: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Fernet_con_coca.JPG" 
    },
    { 
        id: 8, 
        nombre: "Gaseosa Cola 500ml", 
        precio: 1800, 
        imagen: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Full_glass_of_Coca-Cola_with_ice_cubes.jpg" 
    }
];

let carrito = [];
let medioPagoSeleccionado = "Mercado Pago";
const NUMERO_WHATSAPP = "5493510000000"; // Poné tu número real acá

const contenedorProductos = document.getElementById("contenedor-productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");

function renderizarProductos() {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = "";
    productos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("producto-card");
        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width:100%; height:140px; object-fit:cover; border-radius:8px; margin-bottom:12px;">
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
        listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        if (totalCarrito) totalCarrito.innerText = "$0";
        return;
    }

    let totalCalculado = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalCalculado += subtotal;

        const divItem = document.createElement("div");
        divItem.classList.add("item-carrito");
        divItem.innerHTML = `
            <div class="item-info">
                <strong>${item.nombre}</strong>
                <span style="color:#94a3b8; font-size:0.85rem;">$${item.precio.toLocaleString('es-AR')} c/u</span>
            </div>
            <div class="item-controles">
                <button class="btn-qty" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-qty" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                <strong style="margin-left:8px;">$${subtotal.toLocaleString('es-AR')}</strong>
            </div>
        `;
        listaCarrito.appendChild(divItem);
    });

    // Actualizamos el elemento #total fuera del carrito y dentro
    if (totalCarrito) {
        totalCarrito.innerText = `$${totalCalculado.toLocaleString('es-AR')}`;
    }

    // Opciones de Pago
    const divPago = document.createElement("div");
    divPago.classList.add("pago-seccion");
    divPago.innerHTML = `
        <h4 style="margin: 15px 0 8px 0; color:#cbd5e1;">Medio de Pago:</h4>
        <label class="pago-opcion" style="display:block; margin-bottom:6px; cursor:pointer;">
            <input type="radio" name="pago" value="Mercado Pago" checked onclick="seleccionarMedioPago('Mercado Pago')"> Mercado Pago / Transferencia
        </label>
        <label class="pago-opcion" style="display:block; margin-bottom:15px; cursor:pointer;">
            <input type="radio" name="pago" value="Efectivo" onclick="seleccionarMedioPago('Efectivo')"> Efectivo al retirar/recibir
        </label>
    `;
    listaCarrito.appendChild(divPago);

    // Botón verde de envío
    const btnPagar = document.createElement("button");
    btnPagar.classList.add("btn-pago");
    btnPagar.style.cssText = "display:block; width:100%; text-align:center; background:#22c55e; color:white; padding:14px; border-radius:8px; font-weight:bold; font-size:1.1rem; border:none; cursor:pointer; margin-top:10px;";
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
