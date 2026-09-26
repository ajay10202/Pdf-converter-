# FileFlow 2.0 — browser file toolbox

This package is a runnable local web app containing the PDF, conversion, editing, security, AI/text and image tools shown in the reference UI, plus working browser AI background removal.

## Run on Windows

1. Install Python 3.10+.
2. Double-click **run.bat**.
3. The browser opens at `http://127.0.0.1:5500`.
4. Keep the black command window open while using FileFlow.

The server binds only to `127.0.0.1`, so it is not exposed to your LAN by default.

## Tools

**PDF / Organize**: Merge, Split, Remove pages, Extract pages, Organize, Scan/JPG to PDF, Compress, Repair/Normalize, OCR.

**Convert**: JPG to PDF, Word to PDF, PowerPoint to PDF, Excel to PDF, HTML to PDF, PDF to JPG, PDF to Word, PDF to PowerPoint, PDF to Excel, PDF/A metadata normalization.

**Edit**: Rotate, Page numbers, Watermark, Crop, Edit text overlay, PDF Forms.

**Security**: Unlock/re-save, encrypted FileFlow package, visual signature, redaction boxes, text comparison.

**AI / Text**: Local extractive summary, translation-ready text export, PDF to Markdown.

**Images**: JPG/PNG/WebP conversion, compression, resize, crop, AI background removal.

## Background removal — fixed

The old placeholder has been replaced with the actual `@imgly/background-removal` browser engine. The tool:

- runs the segmentation locally in the browser;
- offers ISNet FP16 and quantized ISNet models;
- tries WebGPU first and automatically retries on CPU if GPU inference fails;
- shows model/inference progress;
- previews the transparent PNG;
- provides a separate download button after preview;
- uses the IMG.LY model-data CDN on first use and browser caching afterward.

The current IMG.LY API supports `device: "gpu" | "cpu"`, ISNet model variants, progress callbacks and foreground output. See the official project documentation for current API/license details.

## Important limitations

Some browser tools are intentionally honest about what they do rather than pretending to be Acrobat/Office:

- **PDF compression** rasterizes pages to JPEG, so selectable/vector content is not preserved.
- **OCR** creates a new text PDF from OCR output.
- **PDF → Word** extracts text into DOCX; complex original layout is not reconstructed.
- **PDF → PowerPoint** creates one image slide per PDF page.
- **PowerPoint → PDF** extracts common slide text; complex graphics/charts/animations are not reproduced by the browser-only converter.
- **PDF/A** adds archival metadata but is not a standards-certified PDF/A validator.
- **Protect PDF** creates an AES-GCM encrypted `.ffpdf` FileFlow package. It is not a standard PDF password-encryption wrapper.
- **Sign PDF** adds a visual signature; it is not a cryptographic certificate signature.
- **Translate PDF** exports extracted text for translation rather than claiming to contain a paid translation engine.
- **Unlock PDF** can only re-save a PDF when the browser PDF library can open it; it cannot crack an unknown password.

## Network / privacy

The app processes supported files in the browser. Third-party JavaScript libraries and the background-removal model are loaded from public CDNs when needed. Your selected image/PDF is not uploaded by FileFlow itself.

For a commercial/offline deployment, self-host and pin the third-party JavaScript and model assets.

## Background-removal licensing

`@imgly/background-removal` is distributed under the AGPL according to its project/package metadata. Review the current license before commercial redistribution.

## Output preview and download flow

Every generated output now goes through a **Preview before download** step. FileFlow no longer starts a download automatically when an output is created. PDF outputs open in an embedded preview, images show as previews, text/Markdown can be reviewed, and unsupported binary formats show file information before the Download button is used.

### Merge PDF order

Merge PDF now shows all selected PDFs in a reorderable list. Drag a file or use the **↑ / ↓** controls to set the exact first-to-last order before clicking **Merge PDFs**.

### PDF to JPG / PNG

PDF to image no longer creates a ZIP. Each PDF page is rendered and displayed as an image preview, with an individual **Download JPG** or **Download PNG** button.
