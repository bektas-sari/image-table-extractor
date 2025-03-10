**Image Table Extractor** is a Chrome extension designed to extract tabular data from images on web pages and convert it into CSV format. Using Tesseract.js for Optical Character Recognition (OCR), this tool simplifies the process of retrieving structured data from images, whether accessed via right-click context menu or manual upload.

---

## Features

- **Extract Tables from Images**: Right-click any image on a web page to extract tables and save them as a CSV file.
- **Manual Image Upload**: Upload images directly through the extension popup for processing.
- **CORS Handling**: Bypasses Cross-Origin Resource Sharing (CORS) restrictions using background fetching.
- **User-Friendly Interface**: Simple popup UI with loading indicators and success/error messages.
- **Powered by Tesseract.js**: Leverages robust OCR technology for accurate text recognition.

---

## Installation

### From Chrome Web Store (Coming Soon)
1. Visit the [Chrome Web Store](#) (link to be added once published).
2. Click **Add to Chrome** and confirm the installation.
3. The extension will be added to your browser toolbar.

### Manual Installation (For Developers)
1. Clone or download this repository to your local machine:
   ```bash
   git clone https://github.com/bektas-sari/image-table-extractor.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the folder containing the extension files (e.g., `~\Desktop\veri-extractor`).
5. The extension will appear in your toolbar.

---

## Usage

### Extracting Tables from Web Images
1. Navigate to a web page containing an image with tabular data.
2. Right-click the image.
3. Select **Extract Table to CSV** from the context menu.
4. Wait for the processing to complete (a loading message will appear).
5. The extracted table will be downloaded as `extracted_table.csv`.

### Uploading Images Manually
1. Click the extension icon in the Chrome toolbar to open the popup.
2. Click **Choose File** and select an image from your device.
3. Click **Process Image** to extract the table.
4. The result will be downloaded as a CSV file.

---

## Technical Details

### Architecture
- **Manifest Version**: 3 (Manifest V3 compliant)
- **Background Service Worker**: `background.js` fetches images, bypassing CORS restrictions.
- **Content Script**: `content.js` handles OCR processing with Tesseract.js.
- **Popup**: `popup.html` and `popup.js` provide a manual upload option.
- **Dependencies**: Tesseract.js (bundled locally or loadable via CDN).

### File Structure
```
image-table-extractor/
├── manifest.json       # Extension configuration
├── popup.html          # Popup UI
├── popup.js            # Popup logic
├── content.js          # Image processing and OCR
├── background.js       # Background fetching and context menu
├── style.css           # Popup styling
├── tesseract.min.js    # Tesseract.js library (optional if using CDN)
├── icon.png            # Extension icon (16x16, 48x48, 128x128)
```

### How It Works
1. **Image Fetching**: The background script uses `fetch` to download images as Blobs, avoiding CORS issues.
2. **Blob Processing**: The Blob is passed to the content script, where `URL.createObjectURL` generates a temporary URL.
3. **OCR**: Tesseract.js processes the image and extracts text.
4. **CSV Conversion**: Extracted text is parsed into rows and columns, then saved as a CSV file.

---

## Development

### Prerequisites
- Google Chrome browser
- Basic knowledge of JavaScript, HTML, and CSS
- (Optional) Node.js for local testing with Tesseract.js

### Building the Extension
1. Ensure all files are in the project directory as listed above.
2. Update `manifest.json` if using a CDN for Tesseract.js:
   ```json
   "content_scripts": [
     {
       "matches": ["<all_urls>"],
       "js": ["https://cdn.jsdelivr.net/npm/tesseract.js@4.0.2/dist/tesseract.min.js", "content.js"]
     }
   ]
   ```
3. Load the extension in Chrome via `chrome://extensions/` as described in the **Manual Installation** section.

### Debugging
- Open Chrome DevTools (F12) on a web page or the extension popup.
- Check the **Console** tab for errors or logs.
- Common issues:
  - CORS errors: Ensure `background.js` is correctly fetching images.
  - Tesseract.js not loading: Verify the file or CDN link.

---

## Contributing

Contributions are welcome! To contribute:
1. Fork this repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows the existing style and includes appropriate comments.

---

## Known Issues
- **Large Images**: Processing very large images may take time; consider adding a progress bar.
- **Complex Tables**: OCR accuracy depends on image quality and table complexity.
- **CORS Fallback**: If fetching fails, users must manually upload the image via the popup.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For questions, suggestions, or support, please open an issue on this repository or contact [bektas.sari@gmail.com](mailto:bektas.sari@gmail.com).

