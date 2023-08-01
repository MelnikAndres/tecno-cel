fetch("https://api.bluelytics.com.ar/v2/latest").then(res => res.json()).then(precio =>{
    const dolar = document.getElementById("precio-dolar")
    console.log(precio)
    dolar.innerHTML = "$" + (precio.blue.value_sell+5)
})