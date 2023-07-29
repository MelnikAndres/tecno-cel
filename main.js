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

OPCIONES = ["Nuevos","Semi-Nuevos","Reacondicionados","Accesorios","Usados","Xiaomi"]

const clickOpcion = (opcion) =>{
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("tipo", opcion);
    window.location.search = searchParams.toString();
}
var searchParams = new URLSearchParams(window.location.search);
const setActivo = (opcion) =>{
    const activo = opcion?document.getElementById(opcion):document.getElementById("Nuevos")
    activo.classList.add("active")
}
setActivo(searchParams.get("tipo"))