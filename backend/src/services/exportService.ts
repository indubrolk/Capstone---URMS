import PDFDocument from 'pdfkit';
import * as XLSX from 'xlsx';
import { Response } from 'express';

/**
 * Generic PDF Generation Helper
 */
export const generatePDFReport = (
    res: Response,
    options: {
        title: string;
        subtitle?: string;
        summaryItems?: { label: string; value: string | number }[];
        sections: {
            title: string;
            headers: string[];
            rows: (string | number)[][];
        }[];
    }
) => {
    const doc = new PDFDocument({ margin: 50, bufferPages: true });
    
    // Pipe to response
    doc.pipe(res);

    // 1. Header
    doc.fontSize(22).font('Helvetica-Bold').text(options.title, { align: 'center' });
    if (options.subtitle) {
        doc.moveDown(0.2);
        doc.fontSize(12).font('Helvetica').text(options.subtitle, { align: 'center' });
    }
    doc.moveDown(1.5);

    // 2. Summary Box (if provided)
    if (options.summaryItems && options.summaryItems.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('Overview Summary');
        doc.moveDown(0.5);
        
        const startY = doc.y;
        const boxHeight = (options.summaryItems.length * 20) + 20;
        doc.rect(50, startY, 500, boxHeight).stroke();
        
        doc.fontSize(10).font('Helvetica');
        options.summaryItems.forEach((item, i) => {
            doc.text(`${item.label}:`, 70, startY + 15 + (i * 20));
            doc.font('Helvetica-Bold').text(`${item.value}`, 250, startY + 15 + (i * 20));
            doc.font('Helvetica');
        });
        
        doc.y = startY + boxHeight + 20;
    }

    // 3. Data Sections (Tables)
    options.sections.forEach((section) => {
        // Check for page break before section title
        if (doc.y > 650) doc.addPage();

        doc.moveDown(1);
        doc.fontSize(16).font('Helvetica-Bold').text(section.title);
        doc.moveDown(0.8);

        // Simple Table Implementation
        const startX = 50;
        const colWidth = 500 / section.headers.length;
        
        // Headers
        doc.fontSize(10).font('Helvetica-Bold');
        section.headers.forEach((header, i) => {
            doc.text(header, startX + (i * colWidth), doc.y, { width: colWidth, align: 'left' });
        });
        
        doc.moveDown(0.5);
        doc.moveTo(startX, doc.y).lineTo(startX + 500, doc.y).stroke();
        doc.moveDown(0.5);

        // Rows
        doc.font('Helvetica');
        section.rows.forEach((row) => {
            // Check for page break
            if (doc.y > 700) {
                doc.addPage();
                // Repeat headers on new page? Maybe later. For now just continue.
                doc.fontSize(10).font('Helvetica-Bold');
                section.headers.forEach((header, i) => {
                    doc.text(header, startX + (i * colWidth), doc.y, { width: colWidth, align: 'left' });
                });
                doc.moveDown(0.5);
                doc.moveTo(startX, doc.y).lineTo(startX + 500, doc.y).stroke();
                doc.moveDown(0.5);
                doc.font('Helvetica');
            }

            const rowY = doc.y;
            let maxHeight = 0;

            row.forEach((cell, i) => {
                const cellText = String(cell);
                const options: { width: number; align: 'left' | 'center' | 'right' | 'justify' } = { width: colWidth - 10, align: 'left' };
                const height = doc.heightOfString(cellText, options);
                maxHeight = Math.max(maxHeight, height);
                doc.text(cellText, startX + (i * colWidth), rowY, options);
            });

            doc.y = rowY + maxHeight + 10;
        });
    });

    // 4. Footer
    const pages = doc.bufferedPageRange().count;
    for (let i = 0; i < pages; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).font('Helvetica-Oblique');
        const footerText = `Generated on: ${new Date().toLocaleString()} | URMS Analytics Engine | Page ${i + 1} of ${pages}`;
        doc.text(footerText, 50, 750, { align: 'center', width: 500 });
    }

    doc.end();
};

/**
 * PDF Generation as Buffer (for automated tasks)
 */
export const generatePDFBuffer = (
    options: {
        title: string;
        subtitle?: string;
        summaryItems?: { label: string; value: string | number }[];
        sections: {
            title: string;
            headers: string[];
            rows: (string | number)[][];
        }[];
    }
): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, bufferPages: true });
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            resolve(Buffer.concat(buffers));
        });
        doc.on('error', reject);

        // Re-use logic or call a common builder? 
        // For simplicity, I'll copy the logic here or refactor.
        // Actually, let's refactor generatePDFReport to use a stream.
        
        // 1. Header
        doc.fontSize(22).font('Helvetica-Bold').text(options.title, { align: 'center' });
        if (options.subtitle) {
            doc.moveDown(0.2);
            doc.fontSize(12).font('Helvetica').text(options.subtitle, { align: 'center' });
        }
        doc.moveDown(1.5);

        // 2. Summary Box
        if (options.summaryItems && options.summaryItems.length > 0) {
            doc.fontSize(14).font('Helvetica-Bold').text('Overview Summary');
            doc.moveDown(0.5);
            const startY = doc.y;
            const boxHeight = (options.summaryItems.length * 20) + 20;
            doc.rect(50, startY, 500, boxHeight).stroke();
            doc.fontSize(10).font('Helvetica');
            options.summaryItems.forEach((item, i) => {
                doc.text(`${item.label}:`, 70, startY + 15 + (i * 20));
                doc.font('Helvetica-Bold').text(`${item.value}`, 250, startY + 15 + (i * 20));
                doc.font('Helvetica');
            });
            doc.y = startY + boxHeight + 20;
        }

        // 3. Data Sections
        options.sections.forEach((section) => {
            if (doc.y > 650) doc.addPage();
            doc.moveDown(1);
            doc.fontSize(16).font('Helvetica-Bold').text(section.title);
            doc.moveDown(0.8);
            const startX = 50;
            const colWidth = 500 / section.headers.length;
            doc.fontSize(10).font('Helvetica-Bold');
            section.headers.forEach((header, i) => {
                doc.text(header, startX + (i * colWidth), doc.y, { width: colWidth, align: 'left' });
            });
            doc.moveDown(0.5);
            doc.moveTo(startX, doc.y).lineTo(startX + 500, doc.y).stroke();
            doc.moveDown(0.5);
            doc.font('Helvetica');
            section.rows.forEach((row) => {
                if (doc.y > 700) {
                    doc.addPage();
                    doc.fontSize(10).font('Helvetica-Bold');
                    section.headers.forEach((header, i) => {
                        doc.text(header, startX + (i * colWidth), doc.y, { width: colWidth, align: 'left' });
                    });
                    doc.moveDown(0.5);
                    doc.moveTo(startX, doc.y).lineTo(startX + 500, doc.y).stroke();
                    doc.moveDown(0.5);
                    doc.font('Helvetica');
                }
                const rowY = doc.y;
                let maxHeight = 0;
                row.forEach((cell, i) => {
                    const cellText = String(cell);
                    const opts: any = { width: colWidth - 10, align: 'left' };
                    const height = doc.heightOfString(cellText, opts);
                    maxHeight = Math.max(maxHeight, height);
                    doc.text(cellText, startX + (i * colWidth), rowY, opts);
                });
                doc.y = rowY + maxHeight + 10;
            });
        });

        // 4. Footer
        const pages = doc.bufferedPageRange().count;
        for (let i = 0; i < pages; i++) {
            doc.switchToPage(i);
            doc.fontSize(8).font('Helvetica-Oblique');
            const footerText = `Generated on: ${new Date().toLocaleString()} | URMS Analytics Engine | Page ${i + 1} of ${pages}`;
            doc.text(footerText, 50, 750, { align: 'center', width: 500 });
        }
        doc.end();
    });
};

/**
 * Generic Excel Generation Helper
 */
export const generateExcelReport = (
    res: Response,
    filename: string,
    sheets: {
        name: string;
        data: any[]; // Array of objects
    }[]
) => {
    const wb = XLSX.utils.book_new();

    sheets.forEach((sheet) => {
        const ws = XLSX.utils.json_to_sheet(sheet.data);
        XLSX.utils.book_append_sheet(wb, ws, sheet.name);
    });

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buf);
};

/**
 * Excel Generation as Buffer
 */
export const generateExcelBuffer = (
    sheets: {
        name: string;
        data: any[];
    }[]
): Buffer => {
    const wb = XLSX.utils.book_new();
    sheets.forEach((sheet) => {
        const ws = XLSX.utils.json_to_sheet(sheet.data);
        XLSX.utils.book_append_sheet(wb, ws, sheet.name);
    });
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};
