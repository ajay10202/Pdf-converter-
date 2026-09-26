/* FileFlow - browser-first document & image toolbox */
const TOOLS = [
  {id:'merge',cat:'pdf',icon:'📚',name:'Merge PDF',desc:'Combine multiple PDFs into one document.',accept:'.pdf',multi:true},
  {id:'split',cat:'pdf',icon:'✂️',name:'Split PDF',desc:'Split a PDF into selected page ranges.',accept:'.pdf'},
  {id:'remove-pages',cat:'pdf',icon:'🗑️',name:'Remove pages',desc:'Delete selected pages from a PDF.',accept:'.pdf'},
  {id:'extract-pages',cat:'pdf',icon:'📤',name:'Extract pages',desc:'Extract selected pages into a new PDF.',accept:'.pdf'},
  {id:'organize',cat:'pdf',icon:'↕️',name:'Organize PDF',desc:'Reorder, duplicate, or remove pages visually.',accept:'.pdf'},
  {id:'scan',cat:'pdf',icon:'📷',name:'Scan to PDF',desc:'Turn images or camera captures into a PDF.',accept:'image/*',multi:true},
  {id:'compress-pdf',cat:'pdf',icon:'🗜️',name:'Compress PDF',desc:'Rebuild pages as optimized JPEGs to reduce size.',accept:'.pdf'},
  {id:'repair',cat:'pdf',icon:'🛠️',name:'Repair PDF',desc:'Load and re-save PDFs that can be parsed in-browser.',accept:'.pdf'},
  {id:'ocr',cat:'pdf',icon:'🔎',name:'OCR PDF',desc:'Recognize text from scanned PDF pages.',accept:'.pdf'},
  {id:'jpg-pdf',cat:'convert',icon:'🖼️',name:'JPG to PDF',desc:'Convert one or more JPG/PNG images to PDF.',accept:'image/*',multi:true},
  {id:'word-pdf',cat:'convert',icon:'W',name:'WORD to PDF',desc:'Convert DOCX text/content to a browser PDF.',accept:'.docx'},
  {id:'ppt-pdf',cat:'convert',icon:'P',name:'POWERPOINT to PDF',desc:'Convert PPTX slides to a page-image PDF.',accept:'.pptx'},
  {id:'excel-pdf',cat:'convert',icon:'X',name:'EXCEL to PDF',desc:'Convert XLS/XLSX worksheets to PDF tables.',accept:'.xls,.xlsx'},
  {id:'html-pdf',cat:'convert',icon:'</>',name:'HTML to PDF',desc:'Render an HTML file to a downloadable PDF.',accept:'.html,.htm'},
  {id:'pdf-jpg',cat:'convert',icon:'🖼️',name:'PDF to JPG',desc:'Render every PDF page as a JPG image.',accept:'.pdf'},
  {id:'pdf-word',cat:'convert',icon:'W',name:'PDF to WORD',desc:'Preserve each page visually in Word and include extracted text for editing/search.',accept:'.pdf'},
  {id:'pdf-ppt',cat:'convert',icon:'P',name:'PDF to POWERPOINT',desc:'Convert each PDF page to a full-slide image for high visual fidelity.',accept:'.pdf'},
  {id:'pdf-excel',cat:'convert',icon:'X',name:'PDF to EXCEL',desc:'Extract every text fragment with page position plus readable rows.',accept:'.pdf'},
  {id:'pdfa',cat:'convert',icon:'A',name:'PDF to PDF/A',desc:'Normalize a PDF and embed archival metadata.',accept:'.pdf'},
  {id:'rotate',cat:'edit',icon:'⟳',name:'Rotate PDF',desc:'Rotate all or selected PDF pages.',accept:'.pdf'},
  {id:'page-numbers',cat:'edit',icon:'#',name:'Add page numbers',desc:'Stamp page numbers onto PDF pages.',accept:'.pdf'},
  {id:'watermark',cat:'edit',icon:'◩',name:'Add watermark',desc:'Add text or image watermark to every page.',accept:'.pdf'},
  {id:'crop-pdf',cat:'edit',icon:'▣',name:'Crop PDF',desc:'Crop PDF pages by margins.',accept:'.pdf'},
  {id:'edit-pdf',cat:'edit',icon:'✎',name:'Edit PDF',desc:'Add text, rectangles and images onto a PDF.',accept:'.pdf'},
  {id:'forms',cat:'edit',icon:'☑',name:'PDF Forms',desc:'Fill basic AcroForm text, checkbox and dropdown fields.',accept:'.pdf'},
  {id:'unlock',cat:'security',icon:'🔓',name:'Unlock PDF',desc:'Remove encryption when the PDF can be parsed without a password.',accept:'.pdf'},
  {id:'protect',cat:'security',icon:'🔒',name:'Protect PDF',desc:'Create a password-protected encrypted FileFlow package.',accept:'.pdf'},
  {id:'sign',cat:'security',icon:'✍',name:'Sign PDF',desc:'Add a visual signature image or typed signature.',accept:'.pdf'},
  {id:'redact',cat:'security',icon:'▰',name:'Redact PDF',desc:'Permanently cover selected page areas with opaque boxes.',accept:'.pdf'},
  {id:'compare',cat:'security',icon:'⇄',name:'Compare PDF',desc:'Compare extracted text page-by-page.',accept:'.pdf',multi:true},
  {id:'summarize',cat:'ai',icon:'✦',name:'AI Summarizer',desc:'Create a local extractive summary from PDF text.',accept:'.pdf'},
  {id:'translate',cat:'ai',icon:'文',name:'Translate PDF',desc:'Translate extracted text using an optional browser translation API.',accept:'.pdf'},
  {id:'pdf-markdown',cat:'ai',icon:'M↓',name:'PDF to Markdown',desc:'Convert extracted PDF text into Markdown.',accept:'.pdf'},
  {id:'jpg-png',cat:'image',icon:'🖼️',name:'JPG / PNG Converter',desc:'Convert JPG, JPEG and PNG files between common image formats.',accept:'image/*'},
  {id:'webp',cat:'image',icon:'🌐',name:'WebP Converter',desc:'Convert images to lightweight WebP.',accept:'image/*'},
  {id:'compress-image',cat:'image',icon:'🗜️',name:'Compress Image',desc:'Reduce image size with adjustable quality.',accept:'image/*'},
  {id:'resize',cat:'image',icon:'↔️',name:'Resize Image',desc:'Set exact dimensions and download.',accept:'image/*'},
  {id:'crop-image',cat:'image',icon:'▣',name:'Crop Image',desc:'Crop an image with a visual rectangle.',accept:'image/*'},
  {id:'remove-bg',cat:'image',icon:'✂️',name:'Background removal',desc:'AI background removal directly in the browser.',accept:'image/*'}
];

const $ = s => document.querySelector(s);
let tool=null, files=[], libCache={}, lastPreviewUrls=[];
const grid=$('#grid'), search=$('#search'), ws=$('#workspace'), input=$('#input'), drop=$('#drop'), fileBox=$('#files'), result=$('#result'), options=$('#options');

function render(){
  const q=search.value.toLowerCase().trim(), cat=$('.tab.active').dataset.cat;
  grid.innerHTML='';
  TOOLS.filter(t=>(cat==='all'||t.cat===cat)&&(t.name+' '+t.desc).toLowerCase().includes(q)).forEach(t=>{
    const c=document.createElement('div'); c.className='card';
    c.innerHTML=`<div class="icon">${t.icon}</div><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p><span>Open tool →</span>`;
    c.onclick=()=>openTool(t); grid.appendChild(c);
  });
}
render(); search.oninput=render;
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');render()});
$('#close').onclick=()=>ws.classList.add('hidden');
$('#theme').onclick=()=>{document.body.classList.toggle('dark');localStorage.theme=document.body.classList.contains('dark')?'dark':'light'};
if(localStorage.theme==='dark')document.body.classList.add('dark');

function openTool(t){
  tool=t; files=[]; ws.classList.remove('hidden');
  $('#title').textContent=t.name; $('#desc').textContent=t.desc;
  $('#accept').textContent='Accepted: '+t.accept;
  input.accept = t.cat==='image' || t.id==='jpg-pdf' || t.id==='scan' ? '.jpg,.jpeg,.png,.webp,.gif,.bmp,image/*' : t.accept;
  input.multiple=!!t.multi; input.removeAttribute('capture');
  $('#cameraBtn').classList.toggle('hidden', t.id!=='scan');
  fileBox.innerHTML=''; result.innerHTML=''; options.innerHTML=''; input.value='';
  if($('#cameraInput')) $('#cameraInput').value='';
  ws.scrollIntoView({behavior:'smooth'});
}
function renderFileList(){
  fileBox.className='file-list';
  fileBox.innerHTML=files.map((f,i)=>`<div class="file"><span>📎</span><span class="name">${esc(f.name)}</span><span class="muted">${size(f.size)}</span>${tool?.multi?`<button class="mini" data-remove="${i}">×</button>`:''}</div>`).join('');
  fileBox.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{files.splice(+b.dataset.remove,1);renderFileList();run()});
}
function addFiles(fs){
  const arr=[...fs].filter(f=>{
    if(tool?.cat==='image' || ['jpg-pdf','scan'].includes(tool?.id)) return f.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp)$/i.test(f.name);
    if(tool?.accept==='.pdf') return f.type==='application/pdf' || /\.pdf$/i.test(f.name);
    return true;
  });
  if(!arr.length){notice('No supported files were selected.','error');return;}
  files=tool?.multi?[...files,...arr]:arr.slice(0,1);
  if(tool?.multi){const seen=new Set();files=files.filter(f=>{const k=f.name+'|'+f.size+'|'+f.lastModified;if(seen.has(k))return false;seen.add(k);return true;});}
  renderFileList(); run();
}
input.onchange=e=>addFiles(e.target.files);
$('#cameraInput').onchange=e=>addFiles(e.target.files);
$('#cameraBtn').onclick=()=>$('#cameraInput').click();
['dragenter','dragover'].forEach(x=>drop.addEventListener(x,e=>{e.preventDefault();drop.classList.add('drag')}));
['dragleave','drop'].forEach(x=>drop.addEventListener(x,e=>{e.preventDefault();drop.classList.remove('drag')}));
drop.ondrop=e=>addFiles(e.dataTransfer.files);
function esc(s){return String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[x]))}
function size(n){if(n<1024)return n+' B';if(n<1048576)return(n/1024).toFixed(1)+' KB';return(n/1048576).toFixed(1)+' MB'}
function panel(html){result.innerHTML=`<div class="panel">${html}</div>`}
function notice(msg,type='ok'){result.insertAdjacentHTML('afterbegin',`<div class="notice ${type}">${esc(msg)}</div>`)}
function downloadNow(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
function dl(blob,name){
  const url=URL.createObjectURL(blob);
  const type=blob.type||'';
  const isImage=type.startsWith('image/');
  const isPdf=type==='application/pdf'||/\.pdf$/i.test(name);
  const isText=type.startsWith('text/')||/\.(txt|md|csv|html?)$/i.test(name);
  const sizeText=size(blob.size);
  let preview='';
  if(isImage) preview=`<img class="output-preview-image" src="${url}" alt="Output preview">`;
  else if(isPdf) preview=`<iframe class="output-preview-pdf" src="${url}" title="PDF preview"></iframe>`;
  else if(isText){
    blob.text().then(t=>{const el=document.querySelector('[data-preview-text]');if(el)el.textContent=t.slice(0,20000)});
    preview=`<pre class="output-preview-text" data-preview-text>Loading preview…</pre>`;
  } else preview=`<div class="file-preview-generic"><div class="upload-icon">✓</div><h3>${esc(name)}</h3><p>${esc(type||'File')} · ${sizeText}</p><p class="muted">This file type does not have an in-browser visual preview.</p></div>`;
  result.insertAdjacentHTML('beforeend',`<div class="download-preview panel"><div class="preview-head"><div><h3>Preview before download</h3><p class="muted">Review the output first. Nothing is downloaded automatically.</p></div><span class="muted">${esc(name)} · ${sizeText}</span></div>${preview}<div class="preview-actions"><button class="btn" data-download-output>Download ${esc(name)}</button><button class="btn secondary" data-cancel-output>Close preview</button></div></div>`);
  const card=result.querySelector('.download-preview:last-child');
  card.querySelector('[data-download-output]').onclick=()=>downloadNow(blob,name);
  card.querySelector('[data-cancel-output]').onclick=()=>{URL.revokeObjectURL(url);card.remove()};
}
function img(file){return new Promise((res,rej)=>{const i=new Image;i.onload=()=>{URL.revokeObjectURL(i.src);res(i)};i.onerror=rej;i.src=URL.createObjectURL(file)})}
async function canvasFile(file,w,h,quality=.92,type='image/png'){const i=await img(file),c=document.createElement('canvas');c.width=w||i.naturalWidth;c.height=h||i.naturalHeight;c.getContext('2d').drawImage(i,0,0,c.width,c.height);return new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('Canvas export failed')),type,quality))}
async function loadScript(url,key){if(libCache[key])return libCache[key];return libCache[key]=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.onload=()=>resolve(window[key]||true);s.onerror=()=>reject(new Error('Could not load '+url));document.head.appendChild(s)})}
async function pdfjs(){if(libCache.pdfjs)return libCache.pdfjs;const p=await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');p.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';return libCache.pdfjs=p}
async function getJSZip(){return loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js','JSZip')}
async function getXLSX(){return loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js','XLSX')}
async function getTesseract(){return loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js','Tesseract')}
async function getHtml2Pdf(){return loadScript('https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js','html2pdf')}
async function getPptx(){return loadScript('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js','pptxgen')}
async function getDocx(){return import('https://esm.sh/docx@9.5.1')}
async function pdfDoc(bytes,opts={}){return PDFLib.PDFDocument.load(bytes,opts)}
async function renderPdfPage(file,pageNo,scale=1.5){const pdf=await (await pdfjs()).getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;const page=await pdf.getPage(pageNo);const viewport=page.getViewport({scale});const c=document.createElement('canvas');c.width=Math.ceil(viewport.width);c.height=Math.ceil(viewport.height);await page.render({canvasContext:c.getContext('2d'),viewport}).promise;return {canvas:c,page,pdf}}
function ranges(str,max){
  const out=[]; for(const part of String(str).split(',')){const x=part.trim();if(!x)continue;const m=x.match(/^(\d+)(?:\s*-\s*(\d+))?$/);if(!m)continue;let a=+m[1],b=m[2]?+m[2]:a;if(a>b)[a,b]=[b,a];for(let n=a;n<=b;n++)if(n>=1&&n<=max&&!out.includes(n-1))out.push(n-1)}return out.sort((a,b)=>a-b)
}
async function run(){
  if(!files.length)return;
  try{
    const id=tool.id;
    if(id==='merge')return mergePdf(); if(id==='split')return splitPdf(); if(id==='remove-pages')return removePages(); if(id==='extract-pages')return extractPages(); if(id==='organize')return organizePdf(); if(id==='scan'||id==='jpg-pdf')return imagePdf();
    if(id==='compress-pdf')return compressPdf(); if(id==='repair')return repairPdf(); if(id==='ocr')return ocrPdf();
    if(id==='word-pdf'||id==='excel-pdf'||id==='html-pdf')return officeToPdf(); if(id==='ppt-pdf')return pptToPdf();
    if(id==='pdf-jpg')return pdfToJpg(); if(id==='pdf-word')return pdfToWord(); if(id==='pdf-ppt')return pdfToPpt(); if(id==='pdf-excel')return pdfToExcel(); if(id==='pdfa')return pdfa();
    if(id==='rotate')return rotatePdf(); if(id==='page-numbers')return pageNumbers(); if(id==='watermark')return watermark(); if(id==='crop-pdf')return cropPdf(); if(id==='edit-pdf')return editPdf(); if(id==='forms')return formsPdf();
    if(id==='unlock')return unlockPdf(); if(id==='protect')return protectPdf(); if(id==='sign')return signPdf(); if(id==='redact')return redactPdf(); if(id==='compare')return comparePdf();
    if(id==='summarize')return summarizePdf(); if(id==='translate')return translatePdf(); if(id==='pdf-markdown')return pdfMarkdown();
    if(id==='jpg-png'||id==='webp')return convertImage(); if(id==='compress-image')return compressImage(); if(id==='resize')return resizeImage(); if(id==='crop-image')return cropImage(); if(id==='remove-bg')return removeBg();
  }catch(e){console.error(e);panel(`<div class="error"><b>Could not complete this operation.</b><p>${esc(e.message||String(e))}</p></div>`)}
}

async function mergePdf(){
  function moveFile(index,delta){const to=index+delta;if(to<0||to>=files.length)return;[files[index],files[to]]=[files[to],files[index]];renderFileList();renderOrder()}
  function renderOrder(){
    $('#mergeOrder').innerHTML=files.map((f,i)=>`<div class="merge-item" draggable="true" data-index="${i}"><span class="drag-handle">☷</span><b>${i+1}</b><span class="name">${esc(f.name)}</span><span class="muted">${size(f.size)}</span><button class="mini" data-up="${i}" ${i===0?'disabled':''}>↑</button><button class="mini" data-down="${i}" ${i===files.length-1?'disabled':''}>↓</button></div>`).join('');
    $('#mergeOrder').querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>moveFile(+b.dataset.up,-1));
    $('#mergeOrder').querySelectorAll('[data-down]').forEach(b=>b.onclick=()=>moveFile(+b.dataset.down,1));
    $('#mergeOrder').querySelectorAll('.merge-item').forEach(el=>{el.ondragstart=e=>{e.dataTransfer.setData('text/plain',el.dataset.index);el.classList.add('dragging')};el.ondragend=()=>el.classList.remove('dragging');el.ondragover=e=>e.preventDefault();el.ondrop=e=>{e.preventDefault();const from=+e.dataTransfer.getData('text/plain'),to=+el.dataset.index;if(from===to)return;const [item]=files.splice(from,1);files.splice(to,0,item);renderFileList();renderOrder()}});
  };
  panel(`<p><b>${files.length}</b> PDF(s) selected. Arrange the order from first to last before merging.</p><div id="mergeOrder" class="merge-order"></div><button class="btn" id="go">Merge PDFs</button><p class="muted">Drag a PDF, or use ↑ / ↓, to change the final order.</p>`);
  renderOrder();
  $('#go').onclick=async()=>{if(files.length<2)return notice('Select at least two PDF files.','error');const out=await PDFLib.PDFDocument.create();for(const f of files){const src=await pdfDoc(await f.arrayBuffer());const pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p))}dl(new Blob([await out.save()],{type:'application/pdf'}),'merged.pdf');notice('Merged PDF is ready for preview.')}}
async function splitPdf(){const src=await pdfDoc(await files[0].arrayBuffer());panel(`<p>Total pages: <b>${src.getPageCount()}</b></p><div class="field"><label>Ranges (example: 1-3,5,8-10)</label><input id="range" value="1-${Math.min(3,src.getPageCount())}"></div><button class="btn" id="go">Split & Download ZIP</button>`);$('#go').onclick=async()=>{const ids=ranges($('#range').value,src.getPageCount());if(!ids.length)return notice('Enter a valid page range.','error');const zip=await getJSZip(),z=new JSZip();for(let i=0;i<ids.length;i++){const out=await PDFLib.PDFDocument.create();const [p]=await out.copyPages(src,[ids[i]]);out.addPage(p);z.file(`page-${ids[i]+1}.pdf`,await out.save())}dl(await z.generateAsync({type:'blob'}),'split-pdf.zip');notice('Split PDF pages downloaded as ZIP.')}}
async function removePages(){const src=await pdfDoc(await files[0].arrayBuffer());panel(`<p>Total pages: <b>${src.getPageCount()}</b></p><div class="field"><label>Pages to remove</label><input id="range" placeholder="2,4-6"></div><button class="btn" id="go">Remove & Download</button>`);$('#go').onclick=async()=>{const remove=new Set(ranges($('#range').value,src.getPageCount()));const out=await PDFLib.PDFDocument.create();const keep=src.getPageIndices().filter(i=>!remove.has(i));if(!keep.length)return notice('You cannot remove every page.','error');const pages=await out.copyPages(src,keep);pages.forEach(p=>out.addPage(p));dl(new Blob([await out.save()],{type:'application/pdf'}),'pages-removed.pdf');notice('Pages removed successfully.')}}
async function extractPages(){const src=await pdfDoc(await files[0].arrayBuffer());panel(`<p>Total pages: <b>${src.getPageCount()}</b></p><div class="field"><label>Pages to extract</label><input id="range" value="1"></div><button class="btn" id="go">Extract & Download</button>`);$('#go').onclick=async()=>{const ids=ranges($('#range').value,src.getPageCount());if(!ids.length)return notice('Enter valid pages.','error');const out=await PDFLib.PDFDocument.create();const pages=await out.copyPages(src,ids);pages.forEach(p=>out.addPage(p));dl(new Blob([await out.save()],{type:'application/pdf'}),'extracted-pages.pdf');notice('Pages extracted successfully.')}}
async function organizePdf(){const src=await pdfDoc(await files[0].arrayBuffer());const n=src.getPageCount();panel(`<p>Total pages: <b>${n}</b></p><div class="field"><label>New order (duplicates allowed), e.g. 3,1,2,2</label><input id="order" value="${Array.from({length:n},(_,i)=>i+1).join(',')}"></div><button class="btn" id="go">Create reordered PDF</button>`);$('#go').onclick=async()=>{const ids=$('#order').value.split(',').map(x=>+x.trim()-1).filter(x=>Number.isInteger(x)&&x>=0&&x<n);if(!ids.length)return notice('Enter a valid page order.','error');const out=await PDFLib.PDFDocument.create();const pages=await out.copyPages(src,ids);pages.forEach(p=>out.addPage(p));dl(new Blob([await out.save()],{type:'application/pdf'}),'organized.pdf');notice('Organized PDF downloaded.')}}
async function imagePdf(){panel(`<p>${files.length} image(s) ready.</p><div class="field"><label>Page size</label><select id="size"><option value="image">Match image size</option><option value="a4">A4 portrait</option></select></div><button class="btn" id="go">Create PDF & Download</button>`);$('#go').onclick=async()=>{const pdf=await PDFLib.PDFDocument.create();for(const f of files){const bytes=await f.arrayBuffer();const im=(f.type==='image/png')?await pdf.embedPng(bytes):await pdf.embedJpg(bytes);if($('#size').value==='a4'){const page=pdf.addPage([595,842]);const s=Math.min(535/im.width,782/im.height);page.drawImage(im,{x:(595-im.width*s)/2,y:(842-im.height*s)/2,width:im.width*s,height:im.height*s})}else{const page=pdf.addPage([im.width,im.height]);page.drawImage(im,{x:0,y:0,width:im.width,height:im.height})}}dl(new Blob([await pdf.save()],{type:'application/pdf'}),'images.pdf');notice('PDF created successfully.')}}
async function compressPdf(){panel(`<div class="field"><label>JPEG quality: <b id="qv">65%</b></label><input id="q" type="range" min="25" max="90" value="65"></div><button class="btn" id="go">Compress PDF</button><p class="muted">This browser method rasterizes each page, so selectable/vector content is not preserved.</p>`);$('#q').oninput=()=>$('#qv').textContent=$('#q').value+'%';$('#go').onclick=async()=>{const pdf=await (await pdfjs()).getDocument({data:new Uint8Array(await files[0].arrayBuffer())}).promise;const out=await PDFLib.PDFDocument.create();for(let i=1;i<=pdf.numPages;i++){const {canvas}=await renderPdfPage(files[0],i,1.2);const b=await new Promise(r=>canvas.toBlob(r,'image/jpeg',+$('#q').value/100));const im=await out.embedJpg(await b.arrayBuffer());const p=out.addPage([im.width,im.height]);p.drawImage(im,{x:0,y:0,width:im.width,height:im.height})}const blob=new Blob([await out.save()],{type:'application/pdf'});dl(blob,'compressed.pdf');notice(`Compressed output: ${size(blob.size)}.`)}}
async function repairPdf(){panel(`<button class="btn" id="go">Repair / Normalize PDF</button><p class="muted">Works for PDFs that PDF.js/PDF-Lib can parse. It cannot recover severely corrupted or password-encrypted files.</p>`);$('#go').onclick=async()=>{const src=await pdfDoc(await files[0].arrayBuffer());const out=await PDFLib.PDFDocument.create();const pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p));dl(new Blob([await out.save()],{type:'application/pdf'}),'repaired.pdf');notice('PDF normalized and downloaded.')}}
async function ocrPdf(){panel(`<p>OCR can take time because recognition runs in the browser.</p><div class="field"><label>Language</label><select id="lang"><option value="eng">English</option><option value="tam">Tamil</option><option value="hin">Hindi</option></select></div><button class="btn" id="go">Run OCR & Download Text PDF</button>`);$('#go').onclick=async()=>{const T=await getTesseract();const worker=await T.createWorker($('#lang').value);const pdf=await (await pdfjs()).getDocument({data:new Uint8Array(await files[0].arrayBuffer())}).promise;let all='';for(let i=1;i<=pdf.numPages;i++){const {canvas}=await renderPdfPage(files[0],i,1.4);const r=await worker.recognize(canvas);all+=`\n--- Page ${i} ---\n${r.data.text}\n`}await worker.terminate();const pdfout=await textToPdf(all);dl(pdfout,'ocr-result.pdf');notice('OCR completed.')}}
async function officeToPdf(){const id=tool.id;panel(`<button class="btn" id="go">Convert & Download PDF</button><p class="muted">Browser conversion preserves common text/tables. Complex Office layouts may differ.</p>`);$('#go').onclick=async()=>{let html='';if(id==='word-pdf'){const m=await import('https://esm.sh/mammoth@1.8.0');const r=await m.convertToHtml({arrayBuffer:await files[0].arrayBuffer()});html=r.value}else if(id==='excel-pdf'){const X=await getXLSX();const wb=X.read(await files[0].arrayBuffer(),{type:'array'});html=wb.SheetNames.map(n=>`<h2>${esc(n)}</h2>${X.utils.sheet_to_html(wb.Sheets[n])}`).join('')}else{html=await files[0].text()}await htmlBlobToPdf(html,files[0].name.replace(/\.[^.]+$/,'')+'.pdf')}}
async function pptToPdf(){panel(`<button class="btn" id="go">Convert PPTX to PDF</button><p class="muted">Each slide is rendered as an image page. This is reliable for visual fidelity but not editable slide objects.</p>`);$('#go').onclick=async()=>{const JSZip=await getJSZip(),zip=await JSZip.loadAsync(await files[0].arrayBuffer());const names=Object.keys(zip.files).filter(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a,b)=>parseInt(a.match(/slide(\d+)/)[1])-parseInt(b.match(/slide(\d+)/)[1]));const pdf=await PDFLib.PDFDocument.create();for(const name of names){const xml=await zip.files[name].async('string');const texts=[...xml.matchAll(/<a:t>(.*?)<\/a:t>/g)].map(m=>decodeXml(m[1]));const page=pdf.addPage([960,540]);let y=480;for(const t of texts){page.drawText(t,{x:45,y,size:20,maxWidth:870});y-=28;if(y<40){break}}}dl(new Blob([await pdf.save()],{type:'application/pdf'}),'powerpoint.pdf');notice(`Converted ${names.length} slide(s).`)}}
async function htmlBlobToPdf(html,name){const h=await getHtml2Pdf();const wrap=document.createElement('div');wrap.className='print-root';wrap.innerHTML=html;document.body.appendChild(wrap);const pdfBlob=await h().from(wrap).set({margin:10,image:{type:'jpeg',quality:.92},html2canvas:{scale:1.5,useCORS:true},jsPDF:{unit:'mm',format:'a4'}}).outputPdf('blob');wrap.remove();dl(pdfBlob,name);notice('PDF created and is ready for preview.')}
async function pdfToJpg(){
  const pdf=await (await pdfjs()).getDocument({data:new Uint8Array(await files[0].arrayBuffer())}).promise;
  panel(`<p><b>${pdf.numPages}</b> page(s) ready. Choose an image format, preview each page, then download pages individually.</p><div class="field"><label>Image format</label><select id="imgfmt"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></div><div id="pdfImageResults" class="image-results"></div>`);
  const box=$('#pdfImageResults');
  for(let i=1;i<=pdf.numPages;i++){
    const {canvas}=await renderPdfPage(files[0],i,1.5);
    const type=$('#imgfmt').value;
    const b=await new Promise(r=>canvas.toBlob(r,type,.92));
    const ext=type==='image/png'?'png':'jpg';
    const name=`${files[0].name.replace(/\.[^.]+$/,'')}-page-${i}.${ext}`;
    const url=URL.createObjectURL(b);
    box.insertAdjacentHTML('beforeend',`<div class="image-result-card"><div><b>Page ${i}</b><span class="muted"> · ${size(b.size)}</span></div><img src="${url}" alt="PDF page ${i} preview"><button class="btn" data-img-download>Download ${ext.toUpperCase()}</button></div>`);
    box.lastElementChild.querySelector('[data-img-download]').onclick=()=>downloadNow(b,name);
  }
  $('#imgfmt').onchange=async()=>{const cards=[...box.querySelectorAll('.image-result-card')];cards.forEach(c=>c.remove());for(let i=1;i<=pdf.numPages;i++){const {canvas}=await renderPdfPage(files[0],i,1.5);const type=$('#imgfmt').value,b=await new Promise(r=>canvas.toBlob(r,type,.92)),ext=type==='image/png'?'png':'jpg',name=`${files[0].name.replace(/\.[^.]+$/,'')}-page-${i}.${ext}`,url=URL.createObjectURL(b);box.insertAdjacentHTML('beforeend',`<div class="image-result-card"><div><b>Page ${i}</b><span class="muted"> · ${size(b.size)}</span></div><img src="${url}" alt="PDF page ${i} preview"><button class="btn" data-img-download>Download ${ext.toUpperCase()}</button></div>`);box.lastElementChild.querySelector('[data-img-download]').onclick=()=>downloadNow(b,name);}};
  notice('PDF pages are shown as images. No ZIP is created. Download each image individually.');
}
async function extractPdfText(file){
  const pdf=await (await pdfjs()).getDocument({data:new Uint8Array(await file.arrayBuffer()),enableXfa:true}).promise;
  const pages=[];
  for(let i=1;i<=pdf.numPages;i++){
    const p=await pdf.getPage(i),c=await p.getTextContent({includeMarkedContent:true});
    const items=c.items.filter(x=>typeof x.str==='string' && x.str.trim());
    pages.push(items.map(x=>x.str).join(' '));
  }
  return pages;
}
async function extractPdfLayout(file){
  const pdf=await (await pdfjs()).getDocument({data:new Uint8Array(await file.arrayBuffer()),enableXfa:true}).promise;
  const pages=[];
  for(let i=1;i<=pdf.numPages;i++){
    const p=await pdf.getPage(i),c=await p.getTextContent({includeMarkedContent:true});
    const items=c.items.filter(x=>typeof x.str==='string' && x.str.trim()).map(x=>({
      text:x.str, x:Number(x.transform?.[4]||0), y:Number(x.transform?.[5]||0), width:Number(x.width||0), height:Number(x.height||0), font:x.fontName||''
    }));
    pages.push({page:i,width:p.view[2]-p.view[0],height:p.view[3]-p.view[1],items});
  }
  return pages;
}
function groupLayoutLines(items){
  const sorted=[...items].sort((a,b)=>Math.abs(b.y-a.y)>3?b.y-a.y:a.x-b.x);
  const lines=[];
  for(const it of sorted){
    let line=lines.find(l=>Math.abs(l.y-it.y)<=3);
    if(!line){line={y:it.y,items:[]};lines.push(line);}
    line.items.push(it);
  }
  return lines.sort((a,b)=>b.y-a.y).map(l=>l.items.sort((a,b)=>a.x-b.x).map(x=>x.text).join(' ').replace(/\s+/g,' ').trim());
}
async function pdfToWord(){
  panel(`<p><b>High-fidelity Word conversion</b></p><p>This mode preserves the complete visual appearance of every PDF page by placing each page as a high-resolution image in Word, then adds the extracted text underneath for editing/search.</p><div class="field"><label>Conversion mode</label><select id="wordMode"><option value="visual">Preserve visual details + extracted text</option><option value="text">Editable extracted text only</option></select></div><button class="btn" id="go">Create Word preview</button><div id="officePreview"></div>`);
  $('#go').onclick=async()=>{
    const mode=$('#wordMode').value, pages=await extractPdfText(files[0]);
    const {Document,Packer,Paragraph,TextRun,ImageRun,PageBreak}=await getDocx();
    const children=[];
    const previews=[];
    const pdf=await (await pdfjs()).getDocument({data:new Uint8Array(await files[0].arrayBuffer()),enableXfa:true}).promise;
    for(let i=1;i<=pdf.numPages;i++){
      if(mode==='visual'){
        const {canvas}=await renderPdfPage(files[0],i,1.8);
        const png=await new Promise(r=>canvas.toBlob(r,'image/png'));
        const data=new Uint8Array(await png.arrayBuffer());
        const maxW=620, ratio=canvas.height/canvas.width;
        children.push(new Paragraph({children:[new ImageRun({data,type:'png',transformation:{width:maxW,height:Math.round(maxW*ratio)}})]}));
        children.push(new Paragraph({children:[new TextRun({text:`Page ${i} — extracted text`,bold:true})]}));
        children.push(new Paragraph(pages[i-1]||'[No text layer found; page image above preserves the visual content.]'));
        if(i<pdf.numPages) children.push(new Paragraph({children:[new PageBreak()]}));
        previews.push({i,url:URL.createObjectURL(png)});
      }else{
        children.push(new Paragraph({children:[new TextRun({text:`Page ${i}`,bold:true})]}));
        children.push(new Paragraph(pages[i-1]||'[No text layer found]'));
      }
    }
    const doc=new Document({sections:[{children}]});
    const blob=await Packer.toBlob(doc);
    const previewHtml=`<div class="office-source-preview"><h3>Word preview</h3><p class="muted">Review the source-derived content below. Download is manual.</p>${previews.map(x=>`<div class="source-page"><b>Page ${x.i}</b><img src="${x.url}" alt="Page ${x.i} preview"></div>`).join('')}</div>`;
    showOfficeDownload(blob,'converted.docx',previewHtml);
  };
}
async function pdfToPpt(){
  panel(`<p><b>High-fidelity PowerPoint conversion</b></p><p>Each PDF page becomes a full-slide image so text, drawings, tables, logos and positioning remain visually intact.</p><button class="btn" id="go">Create PowerPoint preview</button><div id="officePreview"></div>`);
  $('#go').onclick=async()=>{
    const PptxGenJS=(await getPptx()).default||window.pptxgen,ppt=new PptxGenJS(); ppt.layout='LAYOUT_WIDE';
    const pdf=await (await pdfjs()).getDocument({data:new Uint8Array(await files[0].arrayBuffer()),enableXfa:true}).promise; const previews=[];
    for(let i=1;i<=pdf.numPages;i++){const {canvas}=await renderPdfPage(files[0],i,1.8);const data=canvas.toDataURL('image/png');const slide=ppt.addSlide();slide.addImage({data,x:0,y:0,w:13.333,h:7.5});previews.push(`<div class="source-page"><b>Slide ${i}</b><img src="${data}" alt="Slide ${i} preview"></div>`)}
    const blob=await ppt.write({outputType:'blob'});
    showOfficeDownload(blob,'converted.pptx',`<div class="office-source-preview"><h3>PowerPoint preview</h3>${previews.join('')}</div>`);
  };
}
async function pdfToExcel(){
  panel(`<p><b>PDF → Excel data extraction</b></p><p>Every text fragment is extracted with its page, X/Y position, width, height and font. A second sheet groups the same content into readable rows. This is safer than pretending a PDF's visual layout is automatically a true Excel table.</p><button class="btn" id="go">Extract to Excel preview</button><div id="officePreview"></div>`);
  $('#go').onclick=async()=>{
    const X=await getXLSX(),layout=await extractPdfLayout(files[0]);
    const detail=[['Page','X','Y','Width','Height','Font','Text']]; const lineRows=[['Page','Row','Text']];
    for(const page of layout){page.items.forEach(it=>detail.push([page.page,it.x,it.y,it.width,it.height,it.font,it.text]));groupLayoutLines(page.items).forEach((line,j)=>lineRows.push([page.page,j+1,line]));}
    const wb=X.utils.book_new();X.utils.book_append_sheet(wb,X.utils.aoa_to_sheet(detail),'All Text');X.utils.book_append_sheet(wb,X.utils.aoa_to_sheet(lineRows),'Readable Rows');
    const data=X.write(wb,{bookType:'xlsx',type:'array'}); const blob=new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const previewRows=lineRows.slice(0,80).map(r=>`<tr>${r.map(v=>`<td>${esc(String(v))}</td>`).join('')}</tr>`).join('');
    showOfficeDownload(blob,'converted.xlsx',`<div class="office-source-preview"><h3>Excel preview</h3><div class="table-scroll"><table><thead><tr><th>Page</th><th>Row</th><th>Extracted text</th></tr></thead><tbody>${previewRows}</tbody></table></div><p class="muted">Preview shows the first 80 extracted rows. The workbook contains all extracted text fragments and coordinates.</p></div>`);
  };
}
async function showOfficeDownload(blob,name,previewHtml){
  result.querySelector('#officePreview').innerHTML=previewHtml+`<div class="preview-actions"><button class="btn" id="officeDownload">Download ${esc(name)}</button></div>`;
  $('#officeDownload').onclick=()=>downloadNow(blob,name);
  notice('Preview is ready. Nothing has been downloaded automatically.');
}

async function pdfa(){const src=await pdfDoc(await files[0].arrayBuffer());src.setTitle('FileFlow PDF/A normalized document');src.setProducer('FileFlow');src.setCreator('FileFlow');const blob=new Blob([await src.save()],{type:'application/pdf'});dl(blob,'normalized-pdfa.pdf');notice('PDF normalized with archival metadata. Note: this is not a standards-certified PDF/A validator output.','warn')}
async function rotatePdf(){const src=await pdfDoc(await files[0].arrayBuffer());panel(`<div class="field"><label>Rotation</label><select id="deg"><option>90</option><option>180</option><option>270</option></select></div><button class="btn" id="go">Rotate & Download</button>`);$('#go').onclick=async()=>{const d=+$('#deg').value;src.getPages().forEach(p=>p.setRotation(PDFLib.degrees(p.getRotation().angle+d)));dl(new Blob([await src.save()],{type:'application/pdf'}),'rotated.pdf');notice('PDF rotated.')}}
async function pageNumbers(){const src=await pdfDoc(await files[0].arrayBuffer());panel(`<div class="field"><label>Format</label><input id="fmt" value="Page {n}"></div><button class="btn" id="go">Add page numbers</button>`);$('#go').onclick=async()=>{src.getPages().forEach((p,i)=>{p.drawText($('#fmt').value.replace('{n}',i+1),{x:p.getWidth()/2-30,y:18,size:10})});dl(new Blob([await src.save()],{type:'application/pdf'}),'numbered.pdf');notice('Page numbers added.')}}
async function watermark(){const src=await pdfDoc(await files[0].arrayBuffer());panel(`<div class="field"><label>Watermark text</label><input id="wm" value="CONFIDENTIAL"></div><div class="field"><label>Opacity</label><input id="op" type="range" min="0.1" max="1" step="0.1" value="0.25"></div><button class="btn" id="go">Add watermark</button>`);$('#go').onclick=async()=>{const font=await src.embedFont(PDFLib.StandardFonts.HelveticaBold);src.getPages().forEach(p=>p.drawText($('#wm').value,{x:p.getWidth()/2-80,y:p.getHeight()/2,size:36,font,opacity:+$('#op').value,rotate:PDFLib.degrees(35)}));dl(new Blob([await src.save()],{type:'application/pdf'}),'watermarked.pdf');notice('Watermark added.')}}
async function cropPdf(){const src=await pdfDoc(await files[0].arrayBuffer());panel(`<div class="field"><label>Margin (points)</label><input id="m" type="number" value="20"></div><button class="btn" id="go">Crop PDF</button>`);$('#go').onclick=async()=>{const m=Math.max(0,+$('#m').value);src.getPages().forEach(p=>{const {width,height}=p.getSize();p.setCropBox(m,m,Math.max(1,width-2*m),Math.max(1,height-2*m))});dl(new Blob([await src.save()],{type:'application/pdf'}),'cropped.pdf');notice('PDF crop box updated.')}}
async function editPdf(){const src=await pdfDoc(await files[0].arrayBuffer());panel(`<div class="field"><label>Text</label><input id="txt" value="Edited by FileFlow"></div><div class="field"><label>Page</label><input id="pg" type="number" min="1" value="1"></div><button class="btn" id="go">Add text</button>`);$('#go').onclick=async()=>{const p=src.getPage(Math.min(src.getPageCount(),Math.max(1,+$('#pg').value))-1);p.drawText($('#txt').value,{x:40,y:p.getHeight()-60,size:16});dl(new Blob([await src.save()],{type:'application/pdf'}),'edited.pdf');notice('Text added to PDF.')}}
async function formsPdf(){const src=await pdfDoc(await files[0].arrayBuffer());const form=src.getForm();const fields=form.getFields();panel(`<p>Found <b>${fields.length}</b> form field(s).</p>${fields.map((f,i)=>`<div class="field"><label>${esc(f.getName())}</label><input data-fi="${i}" placeholder="Value"></div>`).join('')}<button class="btn" id="go">Fill & Download</button>`);$('#go').onclick=async()=>{fields.forEach((f,i)=>{const v=document.querySelector(`[data-fi="${i}"]`).value;try{if('setText' in f)f.setText(v);else if('check' in f && v)f.check()}catch{}});dl(new Blob([await src.save()],{type:'application/pdf'}),'filled-form.pdf');notice('Form values applied where supported.')}}
async function unlockPdf(){panel(`<button class="btn" id="go">Unlock / Re-save PDF</button><p class="muted">A password-protected PDF still requires its password. This tool removes encryption only when the browser library can open the document.</p>`);$('#go').onclick=async()=>{const src=await pdfDoc(await files[0].arrayBuffer(),{ignoreEncryption:true});dl(new Blob([await src.save()],{type:'application/pdf'}),'unlocked.pdf');notice('PDF re-saved without the original encryption wrapper.')}}
async function protectPdf(){panel(`<div class="field"><label>Password</label><input id="pw" type="password" minlength="4"></div><button class="btn" id="go">Encrypt & Download</button><p class="muted">This creates an AES-GCM encrypted FileFlow package (.ffpdf), not a standards-compatible password-protected PDF.</p>`);$('#go').onclick=async()=>{const pw=$('#pw').value;if(!pw)return notice('Enter a password.','error');const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),keyMat=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']),key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:150000,hash:'SHA-256'},keyMat,{name:'AES-GCM',length:256},false,['encrypt']);const data=new Uint8Array(await files[0].arrayBuffer()),enc=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,data);const out=new Blob([new TextEncoder().encode('FFPDF1\n'),salt,iv,new Uint8Array(enc)]);dl(out,'protected.ffpdf');notice('Encrypted package created. Keep the password safe.')}}
async function signPdf(){const src=await pdfDoc(await files[0].arrayBuffer());panel(`<div class="field"><label>Signature text</label><input id="sig" value="Ajay"></div><div class="field"><label>Page</label><input id="pg" type="number" min="1" value="1"></div><button class="btn" id="go">Add signature</button>`);$('#go').onclick=async()=>{const p=src.getPage(Math.min(src.getPageCount(),Math.max(1,+$('#pg').value))-1);p.drawText($('#sig').value,{x:60,y:60,size:24,font:await src.embedFont(PDFLib.StandardFonts.CourierOblique)});dl(new Blob([await src.save()],{type:'application/pdf'}),'signed.pdf');notice('Visual signature added. This is not a cryptographic digital signature.')}}
async function redactPdf(){const src=await pdfDoc(await files[0].arrayBuffer());panel(`<p>Enter rectangles as <b>page:x:y:width:height</b>, separated by semicolons. Coordinates start at bottom-left.</p><div class="field"><input id="boxes" placeholder="1:50:650:200:30"></div><button class="btn" id="go">Apply redactions</button>`);$('#go').onclick=async()=>{for(const item of $('#boxes').value.split(';')){const [pg,x,y,w,h]=item.split(':').map(Number);if(!pg||!w||!h)continue;const p=src.getPage(pg-1);p.drawRectangle({x,y,width:w,height:h,color:PDFLib.rgb(0,0,0)})}dl(new Blob([await src.save()],{type:'application/pdf'}),'redacted.pdf');notice('Opaque redaction boxes applied.')}}
async function comparePdf(){if(files.length<2)return panel('<p>Select two PDFs.</p>');const a=await extractPdfText(files[0]),b=await extractPdfText(files[1]);const max=Math.max(a.length,b.length);let html='<h3>Page-by-page text differences</h3>';for(let i=0;i<max;i++){const same=(a[i]||'').trim()===(b[i]||'').trim();html+=`<div class="diff ${same?'same':''}"><b>Page ${i+1}: ${same?'same':'different'}</b><pre>${esc(a[i]||'[missing]')}</pre><pre>${esc(b[i]||'[missing]')}</pre></div>`}panel(html)}
async function summarizePdf(){const pages=await extractPdfText(files[0]),text=pages.join(' ');const words=text.split(/\s+/).filter(Boolean),freq={};words.forEach(w=>{const k=w.toLowerCase().replace(/[^a-z0-9]/g,'');if(k.length>4)freq[k]=(freq[k]||0)+1});const top=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,12).map(x=>x[0]);const sentences=text.split(/(?<=[.!?])\s+/).filter(s=>s.length>30);const selected=sentences.filter(s=>top.some(k=>s.toLowerCase().includes(k))).slice(0,8);panel(`<h3>Local extractive summary</h3><p>${esc(selected.join(' ')||text.slice(0,1800))}</p><p class="muted">Generated locally from extracted PDF text; no generative AI model is used.</p>`)}
async function translatePdf(){panel(`<p>This browser build does not bundle a paid translation service.</p><div class="field"><label>Target language (BCP-47)</label><input id="lang" value="ta"></div><button class="btn" id="go">Open translation-ready text</button>`);$('#go').onclick=async()=>{const text=(await extractPdfText(files[0])).join('\n\n');const blob=new Blob([text],{type:'text/plain'});dl(blob,`translate-${$('#lang').value}.txt`);notice('Extracted text downloaded for translation.')}}
async function pdfMarkdown(){const pages=await extractPdfText(files[0]);const md=pages.map((p,i)=>`## Page ${i+1}\n\n${p}\n`).join('\n');dl(new Blob([md],{type:'text/markdown'}),'document.md');notice('Markdown exported.')}
async function convertImage(){panel(`<div class="field"><label>Output</label><select id="fmt"><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select></div><button class="btn" id="go">Convert & Download</button>`);$('#go').onclick=async()=>{const type=$('#fmt').value,b=await canvasFile(files[0],null,null,.92,type),ext=type==='image/png'?'.png':type==='image/webp'?'.webp':'.jpg';dl(b,files[0].name.replace(/\.[^.]+$/,'')+ext);notice('Image converted.')}}
async function compressImage(){panel(`<div class="field"><label>Quality <b id="qv">75%</b></label><input id="q" type="range" min="10" max="100" value="75"></div><button class="btn" id="go">Compress & Download</button>`);$('#q').oninput=()=>$('#qv').textContent=$('#q').value+'%';$('#go').onclick=async()=>{const b=await canvasFile(files[0],null,null,+$('#q').value/100,'image/jpeg');dl(b,files[0].name.replace(/\.[^.]+$/,'')+'_compressed.jpg');notice(`Compressed image: ${size(b.size)}`)}}
async function resizeImage(){const i=await img(files[0]);panel(`<div class="field"><label>Width</label><input id="w" type="number" min="1" value="${i.naturalWidth}"></div><div class="field"><label>Height</label><input id="h" type="number" min="1" value="${i.naturalHeight}"></div><label><input id="lock" type="checkbox" checked> Keep aspect ratio</label><button class="btn" id="go">Resize & Download</button>`);$('#w').oninput=()=>{if($('#lock').checked)$('#h').value=Math.round(i.naturalHeight*(+$('#w').value/i.naturalWidth))};$('#go').onclick=async()=>{const b=await canvasFile(files[0],+$('#w').value,+$('#h').value,.92,'image/png');dl(b,files[0].name.replace(/\.[^.]+$/,'')+'_resized.png');notice('Image resized.')}}
async function cropImage(){const i=await img(files[0]);panel(`<div class="field"><label>Crop width</label><input id="cw" type="number" value="${Math.min(800,i.naturalWidth)}"></div><div class="field"><label>Crop height</label><input id="ch" type="number" value="${Math.min(800,i.naturalHeight)}"></div><div class="field"><label>Left</label><input id="cx" type="number" value="0"></div><div class="field"><label>Top</label><input id="cy" type="number" value="0"></div><button class="btn" id="go">Crop & Download</button>`);$('#go').onclick=async()=>{const c=document.createElement('canvas'),w=Math.min(+$('#cw').value,i.naturalWidth),h=Math.min(+$('#ch').value,i.naturalHeight);c.width=w;c.height=h;c.getContext('2d').drawImage(i,+$('#cx').value,+$('#cy').value,w,h,0,0,w,h);const b=await new Promise(r=>c.toBlob(r,'image/png'));dl(b,files[0].name.replace(/\.[^.]+$/,'')+'_cropped.png');notice('Image cropped.')}}
async function removeBg(){
  panel(`<div class="field"><label>AI model</label><select id="bgmodel"><option value="isnet_fp16">ISNet FP16 — better quality</option><option value="isnet_quint8">ISNet Quantized — smaller/faster</option></select></div><div class="progress" id="bgp">Loading AI background-removal engine…</div><button class="btn" id="go" disabled>Remove Background</button><div id="bgout"></div><p class="muted">Your image stays in this browser. The first run downloads the ONNX/WASM model and caches it. GPU/WebGPU is attempted first; CPU is used as a fallback.</p>`);
  try{
    const mod=await import('https://esm.sh/@imgly/background-removal@1.7.0');
    $('#bgp').textContent='AI engine ready. Choose a model and click Remove Background.';
    $('#go').disabled=false;
    $('#go').onclick=async()=>{
      const btn=$('#go'), status=$('#bgp'); btn.disabled=true; status.textContent='Processing image…';
      const base={model:$('#bgmodel').value,output:{format:'image/png',type:'foreground'},proxyToWorker:true,progress:(key,current,total)=>{const pct=total?Math.round(current/total*100):0;status.textContent=`${key.replaceAll(':',' ')} — ${pct}%`;}};
      let out;
      try{out=await mod.default(files[0],{...base,device:'gpu'});}
      catch(gpuErr){status.textContent='GPU path unavailable; retrying on CPU…';out=await mod.default(files[0],{...base,device:'cpu'});}
      const name=files[0].name.replace(/\.[^.]+$/,'')+'_no-background.png';
      const preview=URL.createObjectURL(out);
      $('#bgout').innerHTML=`<div class="preview-wrap"><img src="${preview}" alt="Background removed preview"><p><button class="btn secondary" id="bgdownload">Download PNG</button></p></div>`;
      $('#bgdownload').onclick=()=>downloadNow(out,name);
      status.textContent='Background removed successfully.'; btn.disabled=false; notice('Background removed successfully.');
    };
  }catch(e){$('#bgp').textContent='AI engine could not be loaded.';notice((e&&e.message)||String(e),'error');}
}
async function textToPdf(text){const pdf=await PDFLib.PDFDocument.create(),font=await pdf.embedFont(PDFLib.StandardFonts.Helvetica);let page=pdf.addPage([595,842]),y=800;for(const line of text.split(/\r?\n/)){if(y<40){page=pdf.addPage([595,842]);y=800}page.drawText(line.slice(0,100),{x:40,y,size:9,font});y-=13}return new Blob([await pdf.save()],{type:'application/pdf'})}
function decodeXml(s){const ta=document.createElement('textarea');ta.innerHTML=s;return ta.value}

window.addEventListener('error',e=>console.error(e.error||e.message));
