// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "processImage") {
        extractTextFromImage(message.imageUrl);
    }
});

// OCR işlemini başlatan fonksiyon
async function extractTextFromImage(imageUrl) {
    if (!imageUrl) {
        alert("No image detected!");
        return;
    }

    console.log("Processing image:", imageUrl);

    if (typeof Tesseract === "undefined") {
        alert("Tesseract.js is not loaded properly!");
        return;
    }

    try {
        // 1️⃣ Resmi Canvas'a Çiz ve OCR İçin Hazırla
        const imageBlob = await fetchImageAsBlob(imageUrl);
        if (!imageBlob) {
            alert("Failed to fetch image due to CORS policy.");
            return;
        }

        const canvasUrl = await drawImageOnCanvas(imageBlob);
        console.log("Canvas image ready:", canvasUrl);

        // 2️⃣ OCR İşlemini Başlat
        const worker = await Tesseract.createWorker();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");

        console.log("OCR engine initialized successfully.");

        const { data: { text } } = await worker.recognize(canvasUrl);
        await worker.terminate();

        console.log("OCR result:", text);

        if (!text.trim()) {
            alert("No readable text found in the image!");
            return;
        }

        // 3️⃣ OCR Sonucunu Excel Formatına Çevir ve Kaydet
        convertTextToExcel(text);
    } catch (error) {
        console.error("Error processing image:", error);
        alert("An error occurred while processing the image.");
    }
}

// **CORS sorununu çözmek için resmi indir ve Blob formatına çevir**
async function fetchImageAsBlob(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error("Image fetch failed");
        return await response.blob();
    } catch (error) {
        console.error("Failed to fetch image:", error);
        return null;
    }
}

// **Resmi bir <canvas> içine yükleyerek OCR için uygun hale getir**
async function drawImageOnCanvas(imageBlob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(imageBlob);
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => reject("Failed to draw image on canvas.");
    });
}

// **OCR sonucu düzgün bir Excel dosyasına çevir**
function convertTextToExcel(text) {
    const rows = text.split("\n"); // Satırları ayır
    const data = rows.map(row => row.split(/\s+/)); // Sütunları ayır

    // SheetJS kullanarak Excel oluştur
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Extracted Table");

    // Excel dosyasını kaydet
    XLSX.writeFile(wb, "extracted_table.xlsx");
}
