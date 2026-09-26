# FileFlow 3.0

Complete browser-first file toolbox.

## Run on Windows
1. Extract the ZIP.
2. Double-click `run.bat`.
3. The app opens at `http://127.0.0.1:5500`.

## Important
- Image tools use a normal file input so Android can browse Gallery/Files. The camera is a separate button under Scan to PDF.
- PDF.js is used for PDF rendering/text extraction. PDF.js exposes text items and page rendering, but a PDF does not contain a universal table structure; PDF→Excel therefore exports text with coordinates and grouped rows instead of inventing cells.
- PDF→Word high-fidelity mode embeds each rendered page image and extracted text, preserving visual details while retaining searchable/editable text.
- PDF→PowerPoint uses one rendered image per slide for visual fidelity.
- All generated outputs require an explicit Download click after preview.
- Background removal uses the browser AI model from IMG.LY and downloads model assets on first use.
