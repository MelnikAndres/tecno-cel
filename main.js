
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

const convertirAitem = (celular,precioDolar) =>{
    const pesos = (celular.dolares*precioDolar).toLocaleString()
    return `<div class="producto">
    <div class="img-container">
        <img src="${celular.imagen}" alt="">
    </div>
    <p class="nombre">${celular.nombre}</p>
    <p>Capacidad: ${celular.capacidad}GB</p>
    <div class="precio">
        <p>USD:$${celular.dolares}</p>
        <p>ARS:$${pesos}</p>
    </div>
    <div class="boton-consultar">
        <a href="https://api.whatsapp.com/message/B7JFBEEVOOS7G1?autoload=1&app_absent=0" target="_blank">Consultar</a>
        <div class="wsp-logo-container">
            <img class="wsp-logo" src="./wsp-logo-2.png" alt="">
        </div>
    </div>`
}
const precioDolar = fetch("https://api.bluelytics.com.ar/v2/latest").then(res => res.json())
fetch("https://melnikandres.github.io/tecno-cel/celulares.json").then(res => res.json()).then(data => {
    precioDolar.then(precio => {
    productos.innerHTML = ""
    console.log(data)
    const celulares = data[searchParams.get("tipo")?searchParams.get("tipo"):"Nuevos"]
    if(!celulares){
        productos.innerHTML = "<p>No hay celulares disponibles en esta categoria</p>"
        return
    }
    for(item of celulares){
        productos.innerHTML += convertirAitem(item, precio.blue.value_sell+5)
        productos.innerHTML += convertirAitem(item, precio.blue.value_sell+5)
        productos.innerHTML += convertirAitem(item, precio.blue.value_sell+5)

    }
    })
})
  