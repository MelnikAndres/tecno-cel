
const botonOtros = document.getElementById("boton-otros")
const opcionesOtros = document.getElementById("opciones-otros")
const imgSource = "https://melnikandres.github.io/tecno-cel/imagenes/"

botonOtros.addEventListener("click", () =>{
    if(opcionesOtros.classList.contains("hidden")){
        opcionesOtros.classList.remove("hidden")
    }else{
        opcionesOtros.classList.add("hidden")
    }
})
document.addEventListener("click", (ev)=>{
    if(ev.target === botonOtros){
        return
    }
    if(!opcionesOtros.classList.contains("hidden")){
        opcionesOtros.classList.add("hidden")
    }
})

const OPCIONES = ["Nuevos","Seminuevos","Todos"]

const clickOpcion = (opcion) =>{
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("tipo", opcion);
    
    // Update the URL without reloading
    window.history.pushState({}, '', '?' + searchParams.toString());
    
    // Update the active button
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(opcion).classList.add('active');
    
    // Re-render products with new filter
    if (allProducts.length > 0) {
        precioDolar.then(precio => renderProducts(precio));
    }
}

const clickTipoProducto = (tipoProducto) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("tipoProducto", tipoProducto);
    
    // Update the URL without reloading
    window.history.pushState({}, '', '?' + searchParams.toString());
    
    // Update the active button
    document.querySelectorAll('.product-type-btn').forEach(btn => btn.classList.remove('active'));
    const buttonId = tipoProducto === 'Todos' ? 'TodosProductos' : tipoProducto;
    document.getElementById(buttonId).classList.add('active');
    
    // Re-render products with new filter
    if (allProducts.length > 0) {
        precioDolar.then(precio => renderProducts(precio));
    }
}
var searchParams = new URLSearchParams(window.location.search);
const setActivo = (opcion) =>{
    const activo = opcion?document.getElementById(opcion):document.getElementById("Todos")
    activo.classList.add("active")
    if(OPCIONES.indexOf(opcion)>1){
        const botonSelect = document.getElementById("boton-otros")
        botonSelect.childNodes[0].data = opcion
    }
}

const setActivoTipoProducto = (tipoProducto) => {
    const buttonId = tipoProducto === 'Todos' ? 'TodosProductos' : tipoProducto;
    const activo = tipoProducto ? document.getElementById(buttonId) : document.getElementById("TodosProductos");
    if (activo) {
        document.querySelectorAll('.product-type-btn').forEach(btn => btn.classList.remove('active'));
        activo.classList.add("active");
    }
}

setActivo(searchParams.get("tipo"))
setActivoTipoProducto(searchParams.get("tipoProducto"))

const productos = document.getElementById("productos")

const getBotonConsultar = (agotado, message) =>{
    return agotado?`<p class="consultar-text">Agotado</p>`
    :`<a class="consultar-text" href="https://wa.me/+5491164348539?text=%C2%A1Hola%21+Quer%C3%ADa+consultar+sobre+${encodeURIComponent(message)}" target="_blank">Consultar</a>`
}

const convertirAitem = (celular, precioDolar, tipo) => {
    const pesos = (celular.precio * precioDolar).toLocaleString();
    const message = `${celular.modelo} ${celular.capacidad} ${celular.color}`;
    
    // Handle multiple colors
    const colores = celular.color ? celular.color.split(' / ').map(color => color.trim()) : [];
    const coloresHtml = colores.length > 1 
        ? `<div class="color-carousel">
            <div class="color-carousel-container">
                ${colores.map((color, index) => 
                    `<span class="color-item ${index === 0 ? 'active' : ''}">${color}</span>`
                ).join('')}
            </div>
            <div class="color-indicators">
                ${colores.map((_, index) => 
                    `<span class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
                ).join('')}
            </div>
        </div>`
        : `<span class="spec-value">${celular.color}</span>`;

    return `<div class="producto">
        <div class="img-container">
            <img src="${imgSource + (celular.imagen || 'logo.png')}" alt="">
        </div>
        
        <div class="producto-header">
            <p class="nombre">${celular.modelo}</p>
        </div>
        
        <div class="producto-specs">
            ${celular.capacidad ? `
            <div class="spec-row">
                <span class="spec-label">Capacidad:</span>
                <span class="spec-value">${celular.capacidad}</span>
            </div>` : ''}
            ${celular.color ? `
            <div class="spec-row">
                <span class="spec-label">Color${colores.length > 1 ? 'es' : ''}:</span>
                <div class="color-container">${coloresHtml}</div>
            </div>` : ''}
            ${celular.bateria ? `
            <div class="spec-row">
                <span class="spec-label">Batería:</span>
                <span class="spec-value">${celular.bateria}</span>
            </div>` : ''}
            ${celular.estado ? `
            <div class="spec-row">
                <span class="spec-label">Estado:</span>
                <span class="spec-value">${celular.estado}</span>
            </div>` : ''}
        </div>
        
        ${celular.enCaja ? `<div class="producto-extras">
            <div class="en-caja-badge">✓ En caja original</div>
        </div>` : ''}
        
        ${celular.detalles ? `<div class="producto-detalles">
            <p class="detalles-text">${celular.detalles}</p>
        </div>` : ''}

        <div class="producto-bottom">
        <div class="precio">
            <p>USD: $${celular.precio}</p>
            <p>ARS: $${pesos}<i>?</i></p>
        </div>
        
        <div class="boton-consultar">
            ${getBotonConsultar(false, message)}
            <div class="wsp-logo-container">
                <img class="wsp-logo" src="./wsp-logo-2.png" alt="">
            </div>
        </div>
        </div>
    </div>`;
}
  
const fetchProductos = async () => {
    const url = "https://script.google.com/macros/s/AKfycbwca74ZgrhrQMquxrzz2By_Q49vkEvkQH1TZ7mHbORh_-TUfmgfTerf4Prolmfe1Fr2/exec"; // <- Reemplazá con tu URL real
    const res = await fetch(url);
    const data = await res.json();

    return data.map(item => ({
        linea: item["Línea"] || "",
        modelo: item["Modelo"] || "",
        capacidad: item["Capacidad"] || "",
        color: item["Color"] || "",
        bateria: item["Batería"] || "",
        precio: parseFloat(item["Precio (USD)"]) || 0,
        detalles: item["Detalles extra"] || "",
        enCaja: item["En caja"]?.toString().toLowerCase().includes("sí"),
        estado: item["Estado"] === "Usado" ? "Seminuevo" : "Nuevo" || "",
        tipo: item["Tipo"] || "",
    }));
}

const precioDolar = fetch("https://api.bluelytics.com.ar/v2/latest").then(res => res.json())
let allProducts = []; // Store all products for filtering

fetchProductos().then(data => {
    allProducts = data; // Store the fetched data
    precioDolar.then(precio => {
        setTimeout(() => {
            renderProducts(precio);
        }, 1000);
    });
});

// Function to render products based on current filters
function renderProducts(precio) {
    productos.innerHTML = "";
    productos.classList.remove("cargando");

    const currentParams = new URLSearchParams(window.location.search);
    const tipo = currentParams.get("tipo") || "Todos";
    const tipoProducto = currentParams.get("tipoProducto") || "Todos";
    const searchTerm = document.getElementById("search-input")?.value.toLowerCase() || "";
    const maxPrice = parseFloat(document.getElementById("max-price")?.value) || Infinity;
    
    const filtrado = allProducts.filter(item => {
        let typeMatch = true;
        switch(tipo) {
            case "Nuevos":
                typeMatch = item.estado?.toLowerCase() === "nuevo";
                break;
            case "Seminuevos":
                typeMatch = item.estado?.toLowerCase() === "seminuevo";
                break;
            default:
                typeMatch = true; // Show all if no valid tipo
        }
        
        // Filter by product type (celular/accesorios)
        let productTypeMatch = true;
        switch(tipoProducto) {
            case "celular":
                productTypeMatch = item.tipo?.toLowerCase() === "celular";
                break;
            case "accesorios":
                productTypeMatch = item.tipo?.toLowerCase() === "accesorio";
                break;
            default:
                productTypeMatch = true; // Show all if no valid tipoProducto
        }
        
        // Filter by search term
        const searchMatch = !searchTerm || 
            item.modelo?.toLowerCase().includes(searchTerm) ||
            item.linea?.toLowerCase().includes(searchTerm) ||
            item.color?.toLowerCase().includes(searchTerm) ||
            item.capacidad?.toString().toLowerCase().includes(searchTerm);
        
        // Filter by max price
        const priceMatch = item.precio <= maxPrice;
        
        return typeMatch && productTypeMatch && searchMatch && priceMatch;
    });

    if (filtrado.length === 0) {
        productos.innerHTML = `<p style="text-align:center;">No hay celulares disponibles que coincidan con los filtros</p>`;
        return;
    }

    // Group products by línea
    const groupedByLinea = filtrado.reduce((groups, item) => {
        const linea = item.linea || 'Sin línea';
        if (!groups[linea]) {
            groups[linea] = [];
        }
        groups[linea].push(item);
        return groups;
    }, {});

    // Sort líneas alphabetically
    const sortedLineas = Object.keys(groupedByLinea).sort();

    // Render each group
    sortedLineas.forEach(linea => {
        // Add section header for each línea
        productos.innerHTML += `
            <div class="linea-section">
                <h3 class="linea-title">${linea}</h3>
            </div>
        `;

        // Group products within the línea by modelo
        const productsByModelo = groupedByLinea[linea].reduce((groups, item) => {
            const modelo = item.modelo || 'Sin modelo';
            if (!groups[modelo]) {
                groups[modelo] = [];
            }
            groups[modelo].push(item);
            return groups;
        }, {});

        // Sort modelos within each línea
        const sortedModelos = Object.keys(productsByModelo).sort();

        // Render products for each modelo
        sortedModelos.forEach(modelo => {
            // Sort products by price (lowest first)
            const sortedProducts = productsByModelo[modelo].sort((a, b) => a.precio - b.precio);
            
            sortedProducts.forEach(item => {
                productos.innerHTML += convertirAitem(item, precio.blue.value_sell + 10, tipo);
            });
        });
    });
    
    // Initialize color carousels
    initColorCarousels();
}


// Add event listeners for search and price filter
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById("search-input");
    const priceInput = document.getElementById("max-price");
    const clearFiltersBtn = document.getElementById("clear-filters");
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            precioDolar.then(precio => renderProducts(precio));
        }, 300));
    }
    
    if (priceInput) {
        priceInput.addEventListener('input', debounce(() => {
            precioDolar.then(precio => renderProducts(precio));
        }, 300));
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            // Clear search input
            if (searchInput) searchInput.value = '';
            // Clear price filter
            if (priceInput) priceInput.value = '';
            // Reset product type filter to "Todos"
            document.querySelectorAll('.product-type-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('TodosProductos').classList.add('active');
            // Update URL to remove tipoProducto parameter
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.delete('tipoProducto');
            window.history.pushState({}, '', currentParams.toString() ? '?' + currentParams.toString() : window.location.pathname);
            // Re-render products
            precioDolar.then(precio => renderProducts(precio));
        });
    }
});

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Color carousel functionality
function initColorCarousels() {
    const carousels = document.querySelectorAll('.color-carousel');
    
    carousels.forEach(carousel => {
        const indicators = carousel.querySelectorAll('.indicator');
        const colorItems = carousel.querySelectorAll('.color-item');
        const colorContainer = carousel.querySelector('.color-carousel-container');
        let currentIndex = 0;
        
        function showColor(index) {
            // Hide all colors
            colorItems.forEach(item => item.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Show selected color
            colorItems[index].classList.add('active');
            indicators[index].classList.add('active');
            
            currentIndex = index;
        }
        
        // Add click handlers to indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showColor(index);
            });
        });
        
        // Add click handler to the color container to cycle through colors
        colorContainer.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % colorItems.length;
            showColor(currentIndex);
        });
        
        // Add cursor pointer style to indicate it's clickable
        colorContainer.style.cursor = 'pointer';
    });
}