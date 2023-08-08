const owner = 'melnikandres';
const repo = 'tecno-cel';
const filePath = './celulares.json';
const branch = 'main';
const convertirAitem = (celular) =>{
    return `<div class="celular">
    <span>Nombre: <input type="text" placeholder="Iphone 11" value="${celular.nombre}"></span>
    <span>Capacidad: <input type="text" placeholder="64" value="${celular.capacidad}"> GB</span>
    <span>Dolares: $<input type="number" placeholder="520" value="${celular.dolares}"></span>
    <span>Imagen: <input type="text" placeholder="celular.png" value="${celular.imagen}"></span>
    <span>Agotado: <input type="checkbox" ${celular.agotado?"checked":""}> (check = agotado)</span>
</div>`
}
const productos = document.getElementById("productos")
fetch("https://melnikandres.github.io/tecno-cel/celulares.json").then(res => res.json()).then(data => {
    productos.innerHTML = ""
    console.log(data)
    for(tipo in data){
        productos.innerHTML += `<h3>${tipo}</h3>`
        for(item of data[tipo]){
            productos.innerHTML += convertirAitem(item)
        }
    }
})


async function getFileSha(fileName) {
    const tokenInput = document.getElementById('tokenInput');
    const token = tokenInput.value;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}?ref=${branch}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        return data.sha;
    } else {
        const data = await response.json();
        throw new Error(`Error getting file SHA: ${data.message}`);
    }
}

async function uploadFile() {
    const tokenInput = document.getElementById('tokenInput');
    const fileInput = document.getElementById('fileInput');
    const token = tokenInput.value;
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
        const fileContent = event.target.result;
        const encodedContent = btoa(fileContent);

        try {
            const fileName = file.name;
            const sha = await getFileSha(fileName);

            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;
            const commitMessage = 'Upload file via JavaScript';

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': file.type === 'application/json' ? 'application/json' : file.type,
                },
                body: JSON.stringify({
                    message: commitMessage,
                    content: encodedContent,
                    sha: sha, // Include the obtained SHA in the request
                    branch: branch,
                }),
            });

            if (response.ok) {
                alert('File uploaded successfully.');
            } else {
                const data = await response.json();
                console.error('Error uploading file:', data.message);
                alert('Error uploading file. Check the console for details.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file. Check the console for details.');
        }
    };

    reader.readAsBinaryString(file); // Use readAsBinaryString for images
}

async function uploadJson() {
    const jsonDataInput = document.getElementById('jsonData');
    const jsonData = jsonDataInput.value;

    try {
        const fileName = 'data.json';
        const sha = await getFileSha(fileName);
        const encodedContent = btoa(JSON.stringify(jsonData));

        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;
        const commitMessage = 'Upload JSON data via JavaScript';

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: commitMessage,
                content: encodedContent,
                sha: sha, // Include the obtained SHA in the request
                branch: branch,
            }),
        });

        if (response.ok) {
            alert('JSON data uploaded successfully.');
        } else {
            const data = await response.json();
            console.error('Error uploading JSON data:', data.message);
            alert('Error uploading JSON data. Check the console for details.');
        }
    } catch (error) {
        console.error('Error uploading JSON data:', error);
        alert('Error uploading JSON data. Check the console for details.');
    }
}