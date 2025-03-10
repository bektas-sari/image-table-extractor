document.getElementById("processImage").addEventListener("click", async () => {
    const fileInput = document.getElementById("uploadImage");
    if (!fileInput.files.length) {
        alert("Please select an image!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async function () {
        const imageUrl = reader.result;
        try {
            await extractTextFromImage(imageUrl); // Call the function from content.js
        } catch (error) {
            console.error("Popup error:", error);
            alert(`Failed to process image: ${error.message}`);
        }
    };

    reader.onerror = () => {
        alert("Failed to read the uploaded file!");
    };
});