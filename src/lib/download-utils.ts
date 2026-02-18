/**
 * Download utility functions for exporting content in various formats
 */

import { markdownToTextSync, markdownToHtmlSync } from './markdown-utils'

/**
 * Download content as plain text file
 */
export const downloadAsText = (content: string, filename: string = 'content.txt'): void => {
  const plainText = markdownToTextSync(content)
  const blob = new Blob([plainText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.txt') ? filename : `${filename}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download content as PDF
 * Uses browser print dialog - users can save as PDF from the print dialog
 */
export const downloadAsPDF = (content: string, filename: string = 'content.pdf'): void => {
  try {
    const htmlContent = markdownToHtmlSync(content)
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>${filename}</title>
            <style>
              @media print {
                @page { margin: 1in; }
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              h1, h2, h3, h4, h5, h6 {
                margin-top: 1.5em;
                margin-bottom: 0.5em;
              }
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
              }
              table th, table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              table th {
                background-color: #f2f2f2;
                font-weight: bold;
              }
              code {
                background-color: #f4f4f4;
                padding: 2px 6px;
                border: 1px solid #d0d0d0;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 10pt;
                white-space: pre-wrap;
                word-wrap: break-word;
                overflow-wrap: break-word;
              }
              pre {
                background-color: #f5f5f5;
                padding: 12px 16px;
                margin: 12px 0;
                border-radius: 5px;
                overflow-x: visible;
                overflow-wrap: break-word;
                word-wrap: break-word;
                font-family: 'Courier New', 'Consolas', 'Monaco', monospace;
                font-size: 9pt;
                line-height: 1.5;
                white-space: pre-wrap;
                max-width: 100%;
              }
              pre code {
                background-color: transparent;
                padding: 0;
                border: none;
                border-radius: 0;
                font-size: inherit;
                white-space: pre-wrap;
                word-wrap: break-word;
                overflow-wrap: break-word;
              }
              blockquote {
                border-left: 4px solid #ddd;
                padding-left: 1em;
                margin-left: 0;
                color: #666;
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    } else {
      // If popup blocked, fallback to HTML download
      downloadAsHTML(content, filename.replace('.pdf', '.html'))
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    // Fallback: download as HTML
    downloadAsHTML(content, filename.replace('.pdf', '.html'))
  }
}

/**
 * Download content as Excel/CSV file
 * Uses CSV format (Excel can open CSV files)
 * For native .xlsx support, install xlsx: npm install xlsx
 */
export const downloadAsExcel = (content: string, filename: string = 'content.xlsx'): void => {
  // Use CSV format which Excel can open natively
  // Change extension to .csv for better compatibility
  const csvFilename = filename.replace('.xlsx', '.csv').replace('.xls', '.csv')
  downloadAsCSV(content, csvFilename)
}

/**
 * Download content as CSV file
 */
export const downloadAsCSV = (content: string, filename: string = 'content.csv'): void => {
  // Split content into lines to preserve nested bullets and headings
  const lines = content.split('\n');

  // Wrap each line in quotes and escape any quotes inside
  const csvRows = lines.map(line => `"${line.replace(/"/g, '""')}"`);

  // Join with \n so Excel reads each line as a new row
  const csvContent = csvRows.join('\n');

  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};



/**
 * Download content as Word document (HTML format that Word can open)
 */
export const downloadAsWord = (content: string, filename: string = 'content.docx'): void => {
  const htmlContent = markdownToHtmlSync(content)
  const fullHtml = `
    <!DOCTYPE html>
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>90</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <style>
          @page {
            margin: 1in;
          }
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            line-height: 1.6;
            color: #000;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: bold;
          }
          h1 { font-size: 24px; }
          h2 { font-size: 20px; }
          h3 { font-size: 18px; }
          h4 { font-size: 16px; }
          h5 { font-size: 14px; }
          h6 { font-size: 12px; }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
          }
          table th, table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          table th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            font-family: 'Courier New', monospace;
          
            border-radius: 3px;
            white-space: pre;
          }
          pre {
            background-color: #f5f5f5;
            padding: 10px;
            margin: 12px 0;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            line-height: 1.5;
            white-space: pre;
            word-wrap: break-word;
          }
          pre code {
            background-color: transparent;
            padding: 0;
            border: none;
            border-radius: 0;
            font-size: inherit;
            white-space: pre;
          }
          blockquote {
            border-left: 4px solid #ccc;
            padding-left: 1em;
            margin-left: 0;
            color: #666;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `
  
  const blob = new Blob(['\ufeff', fullHtml], { 
    type: 'application/msword' 
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.docx') || filename.endsWith('.doc') 
    ? filename.replace('.docx', '.doc')
    : `${filename}.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download content as HTML file
 */
export const downloadAsHTML = (content: string, filename: string = 'content.html'): void => {
  const htmlContent = markdownToHtmlSync(content)
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${filename}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
          }
          table th, table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          table th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
          }
          pre {
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
          }
          blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1em;
            margin-left: 0;
            color: #666;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `
  
  const blob = new Blob([fullHtml], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.html') ? filename : `${filename}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}