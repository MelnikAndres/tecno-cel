const owner = 'melnikandres';
const repo = 'tecno-cel';
const filePath = './celulares.json';
const token = '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';
const branch = 'main';

async function getFileSha(fileName) {
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
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = async function(event) {
        const fileContent = event.target.result;
        const encodedContent = btoa(fileContent);
        
        try {
            const fileName = file.name;
            const sha = await getFileSha(fileName);
            
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;
            const commitMessage = 'Upload JSON file via JavaScript';
            
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
    
    reader.readAsText(file);
}