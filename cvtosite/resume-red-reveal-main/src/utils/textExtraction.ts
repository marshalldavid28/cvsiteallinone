
import * as pdfjs from "pdfjs-dist";

// Set the worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
        const loadingTask = pdfjs.getDocument({ data: typedArray });
        
        loadingTask.promise.then(async (pdf) => {
          try {
            let fullText = "";
            
            for (let i = 1; i <= pdf.numPages; i++) {
              try {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const textItems = textContent.items;
                
                // Extract text from each text item
                let pageText = "";
                for (const item of textItems) {
                  if ('str' in item) {
                    pageText += item.str + " ";
                  }
                }
                
                fullText += pageText + "\n\n";
              } catch (pageError) {
                console.warn(`Error extracting text from page ${i}:`, pageError);
                // Continue with other pages even if one fails
              }
            }
            
            if (fullText.trim().length > 0) {
              resolve(fullText);
            } else {
              reject(new Error("Could not extract any text from the PDF. The PDF might be scanned or contain only images."));
            }
          } catch (processingError) {
            reject(processingError);
          }
        }).catch(pdfError => {
          reject(new Error(`Failed to load PDF: ${pdfError.message}`));
        });
      } catch (error) {
        console.error("Error parsing PDF:", error);
        reject(error);
      }
    };
    
    fileReader.onerror = (error) => {
      reject(error);
    };
    
    fileReader.readAsArrayBuffer(file);
  });
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsText(file);
  });
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  let extractedText = "";
  
  if (file.type === "application/pdf") {
    extractedText = await extractTextFromPDF(file);
  } else if (
    file.type === "application/msword" || 
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    // For Word documents, we're still using a basic text extraction
    // In a production app, you'd want to use a proper DOCX parser
    extractedText = await readFileAsText(file);
  } else if (file.type === "text/plain") {
    extractedText = await readFileAsText(file);
  }
  
  return extractedText;
};
