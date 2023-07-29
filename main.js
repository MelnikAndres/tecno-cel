const botonOtros = document.getElementById("boton-otros")
const opcionesOtros = document.getElementById("opciones-otros")

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

const OPCIONES = ["Nuevos","Semi-Nuevos","Reacondicionados","Accesorios","Usados","Xiaomi"]

const clickOpcion = (opcion) =>{
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("tipo", opcion);
    window.location.search = searchParams.toString();
}
var searchParams = new URLSearchParams(window.location.search);
const setActivo = (opcion) =>{
    const activo = opcion?document.getElementById(opcion):document.getElementById("Nuevos")
    activo.classList.add("active")
    if(OPCIONES.indexOf(opcion)>1){
        const botonSelect = document.getElementById("boton-otros")
        botonSelect.childNodes[0].data = opcion
    }
}
setActivo(searchParams.get("tipo"))

const productos = document.getElementById("productos")

const preciazo = 520

const convertirAitem = (celular) =>{
    return `<div class="producto">
    <div class="img-container">
        <img src="${celular.imagen}" alt="">
    </div>
    <p class="nombre">${celular.nombre}</p>
    <p>Capacidad: ${celular.capacidad}</p>
    <div class="precio">
        <p>USD:$${celular.dolares}</p>
        <p>ARS:-</p>
    </div>
    <div class="boton-consultar">
        <a href="https://api.whatsapp.com/message/B7JFBEEVOOS7G1?autoload=1&app_absent=0" target="_blank">Consultar</a>
        <div class="wsp-logo-container">
            <img class="wsp-logo" src="./wsp-logo-2.png" alt="">
        </div>
    </div>`
}
const data = fetch("./celulares.json").then(res => res.json()).then(data => data)
console.log(data)
for(item of data[searchParams.get("tipo")]){
    productos.innerHTML += convertirAitem(item)
}
