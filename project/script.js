document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    const uploadForm = document.getElementById('uploadForm');
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = document.getElementById('submitButton');

    // Configurazione
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const API_ENDPOINT = 'https://api.example.com/upload'; // Sostituire con l'endpoint reale

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Handle file input change
    fileInput.addEventListener('change', handleFiles, false);

    // Click on drop zone to trigger file input
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function handleFiles(e) {
        const files = [...e.target.files];
        errorMessage.textContent = '';
        
        // Validazione dei file
        const validFiles = files.filter(file => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                errorMessage.textContent = 'Sono supportati solo file immagine (JPEG, PNG, GIF, WEBP)';
                return false;
            }
            if (file.size > MAX_FILE_SIZE) {
                errorMessage.textContent = 'Le immagini non possono superare i 5MB';
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            validFiles.forEach(previewFile);
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    function previewFile(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = function() {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = reader.result;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = () => {
                previewItem.remove();
                if (previewContainer.children.length === 0) {
                    submitButton.disabled = true;
                }
            };
            
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            previewContainer.appendChild(previewItem);
        };
    }

    // Gestione dell'invio del form
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const files = fileInput.files;
        
        if (files.length === 0) {
            errorMessage.textContent = 'Per favore, seleziona almeno un\'immagine.';
            return;
        }

        showLoading();
        errorMessage.textContent = '';

        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }

            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                body: formData,
                // Aggiungi qui eventuali headers necessari
                // headers: {
                //     'Authorization': 'Bearer your-token-here'
                // }
            });

            if (!response.ok) {
                throw new Error(`Errore del server: ${response.status}`);
            }

            const result = await response.json();
            console.log('Upload completato:', result);
            
            // Reset del form
            uploadForm.reset();
            previewContainer.innerHTML = '';
            submitButton.disabled = true;
            errorMessage.textContent = 'Caricamento completato con successo!';
            errorMessage.style.color = '#28a745';

        } catch (error) {
            console.error('Errore durante l\'upload:', error);
            errorMessage.textContent = 'Si è verificato un errore durante il caricamento. Riprova più tardi.';
            errorMessage.style.color = '#dc3545';
        } finally {
            hideLoading();
        }
    });

    function showLoading() {
        loadingContainer.classList.add('active');
        submitButton.disabled = true;
    }

    function hideLoading() {
        loadingContainer.classList.remove('active');
        submitButton.disabled = false;
    }
}); 