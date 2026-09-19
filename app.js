const productos = [
    { 
        id: 1, 
        nombre: "Lomito Completo Cordobés", 
        precio: 8500, 
        imagen: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80" 
    },
    { 
        id: 2, 
        nombre: "Cerveza Artesanal IPA 500ml", 
        precio: 3200, 
        imagen: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80" 
    },
    { 
        id: 3, 
        nombre: "Pizza Especial de la Casa", 
        precio: 9800, 
        imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80" 
    },
    { 
        id: 4, 
        nombre: "Empanada Criolla (Unidad)", 
        precio: 1100, 
        imagen: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80" 
    }
];

let carrito = [];

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
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        contenedorProductos.appendChild(tarjeta);
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const itemEnCarrito = carrito.find(item => item.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    renderizarCarrito();
}

function renderizarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        totalCarrito.innerText = "$0";
        return;
    }

    let total = 0;
    let mensajeWhatsApp = "¡Hola! Quisiera hacer el siguiente pedido:%0A";

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensajeWhatsApp += `- ${item.cantidad}x ${item.nombre} ($${subtotal.toLocaleString()})%0A`;

        const divItem = document.createElement("div");
        divItem.classList.add("item-carrito");
        divItem.innerHTML = `
            <span>${item.nombre} x${item.cantidad}</span>
            <span>$${subtotal.toLocaleString()}</span>
        `;
        listaCarrito.appendChild(divItem);
    });

    mensajeWhatsApp += `%0ATotal: $${total.toLocaleString()}`;
    totalCarrito.innerText = `$${total.toLocaleString()}`;

    // Botón de WhatsApp
    const btnWsp = document.createElement("a");
    btnWsp.href = `https://wa.me/5493510000000?text=${mensajeWhatsApp}`; // Reemplaza por tu número
    btnWsp.target = "_blank";
    btnWsp.innerText = "Pedir por WhatsApp";
    btnWsp.style.cssText = "display:block; text-align:center; background:#22c55e; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; margin-top:15px;";
    
    listaCarrito.appendChild(btnWsp);
}

renderizarProductos();
