import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker using a reliable CDN (UNPKG)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * Merges multiple PDF files into a single PDF
 */
export async function mergePDFs(files: File[], onProgress?: (p: number) => void): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
    
    if (onProgress) {
      onProgress(((i + 1) / files.length) * 100);
    }
  }
  
  return await mergedPdf.save();
}

/**
 * Converts PDF pages to images
 */
export async function pdfToImages(file: File, onProgress?: (p: number) => void): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const images: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    images.push(canvas.toDataURL('image/png'));
    
    if (onProgress) {
      onProgress((i / numPages) * 100);
    }
  }

  return images;
}

/**
 * Utility to download images
 */
export async function downloadImages(images: string[], baseName: string) {
  images.forEach((img, i) => {
    const link = document.createElement('a');
    link.href = img;
    link.download = `${baseName}_Page_${i + 1}.png`;
    link.click();
  });
}

/**
 * Adds a text watermark to all pages of a PDF
 */
export async function watermarkPDF(file: File, text: string, onProgress?: (p: number) => void): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();
  const total = pages.length;

  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 4,
      y: height / 2,
      size: 50,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.3,
      rotate: { angle: 45, type: 'degrees' as any },
    });
    if (onProgress) {
      onProgress(((index + 1) / total) * 100);
    }
  });

  return await pdf.save();
}

/**
 * Converts HTML string to PDF
 */
export async function htmlToPDF(html: string, onProgress?: (p: number) => void): Promise<Uint8Array> {
  // Create a container for rendering
  const container = document.createElement('div');
  container.id = 'pdf-render-container';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px'; 
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.padding = '40px';
  container.style.fontFamily = 'Arial, sans-serif'; // Default font for PDF
  container.innerHTML = html;
  document.body.appendChild(container);

  if (onProgress) onProgress(30);

  // Wait for any images or styles to settle
  await new Promise(resolve => setTimeout(resolve, 800));

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: 800, // Ensure consistent viewport
  });

  if (canvas.width === 0 || canvas.height === 0) {
    document.body.removeChild(container);
    throw new Error("Intelligence failure: Rendered canvas is empty.");
  }

  document.body.removeChild(container);
  
  if (onProgress) onProgress(70);

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  const imgProps = pdf.getImageProperties(imgData);
  const contentHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let heightLeft = contentHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, contentHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position -= pdfHeight; 
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, contentHeight);
    heightLeft -= pdfHeight;
  }
  
  if (onProgress) onProgress(100);

  return new Uint8Array(pdf.output('arraybuffer'));
}

/**
 * Converts images to a single PDF
 */
export async function imagesToPDF(files: File[], onProgress?: (p: number) => void): Promise<Uint8Array> {
  const pdf = new jsPDF();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    const imageData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });

    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = imageData;
    });

    const imgProps = pdf.getImageProperties(imageData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    if (i > 0) pdf.addPage();
    pdf.addImage(imageData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    
    if (onProgress) {
      onProgress(((i + 1) / files.length) * 100);
    }
  }

  return new Uint8Array(pdf.output('arraybuffer'));
}

/**
 * Splits a PDF into multiple PDFs, one for each page
 */
export async function splitPDF(file: File, onProgress?: (p: number) => void): Promise<Uint8Array[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  const results: Uint8Array[] = [];

  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(copiedPage!);
    results.push(await newPdf.save());
    
    if (onProgress) {
      onProgress(((i + 1) / pageCount) * 100);
    }
  }

  return results;
}

/**
 * Rotates all pages in a PDF
 */
export async function rotatePDF(file: File, degrees: number, onProgress?: (p: number) => void): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  
  const total = pages.length;
  pages.forEach((page, index) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation({ angle: (currentRotation + degrees) % 360 });
    if (onProgress) {
      onProgress(((index + 1) / total) * 100);
    }
  });

  return await pdf.save();
}

/**
 * Encrypts a PDF with a password
 */
export async function encryptPDF(file: File, password: string, onProgress?: (p: number) => void): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  if (onProgress) onProgress(50);
  
  return await pdf.save({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: 'lowResolution',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false,
    },
  });
}

/**
 * Removes specified pages from a PDF
 * @param pageIndices 0-indexed array of page indices to REMOVE
 */
export async function removePagesFromPDF(file: File, pageIndices: number[], onProgress?: (p: number) => void): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // To delete pages, we work backwards to avoid index shifting
  const sortedIndices = [...pageIndices].sort((a, b) => b - a);
  const total = sortedIndices.length;

  sortedIndices.forEach((index, i) => {
    if (index >= 0 && index < pdf.getPageCount()) {
      pdf.removePage(index);
    }
    if (onProgress) {
      onProgress(((i + 1) / total) * 100);
    }
  });

  return await pdf.save();
}

/**
 * Utility to download multiple files (as individual downloads or potentially a zip)
 */
export async function downloadMultiple(data: Uint8Array[], baseName: string) {
  for (let i = 0; i < data.length; i++) {
    downloadBlob(data[i]!, `${baseName}_Page_${i + 1}.pdf`);
    // Small delay to prevent browser blocking multiple downloads
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

/**
 * Utility to download the resulting PDF
 */
export function downloadBlob(data: Uint8Array, fileName: string) {
  const blob = new Blob([data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
