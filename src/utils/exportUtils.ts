import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { FlashcardData } from '@/context/StoreContext';

/**
 * Export to Excel (.xlsx)
 */
export const exportToExcel = (flashcards: FlashcardData[], filename = 'flashcards.xlsx') => {
    const worksheet = XLSX.utils.json_to_sheet(flashcards.map(c => ({
        Front: c.front,
        Back: c.back
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Flashcards");
    XLSX.writeFile(workbook, filename);
};

/**
 * Export to JSON (.json)
 */
export const exportToJSON = (flashcards: FlashcardData[], filename = 'flashcards.json') => {
    const dataStr = JSON.stringify(flashcards, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    saveAs(blob, filename);
};

/**
 * Export to PDF (.pdf) - Clean layout
 */
export const exportToPDF = (items: any[], filename = 'study-set.pdf', type: string = 'flashcards') => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let title = "Study Set";
    if (type === 'flashcards') title = "Flashcards Study Set";
    else if (type.includes('worksheet')) title = "Educational Worksheet";
    else if (type.includes('exam')) title = "Practice Exam / Study Guide";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(title, margin, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 32);

    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(margin, 35, pageWidth - margin, 35);

    let y = 50;

    items.forEach((item, index) => {
        const itemNumber = index + 1;
        const qLabel = type === 'flashcards' ? "QUESTION" : `QUESTION ${itemNumber}`;
        const aLabel = type === 'flashcards' ? "ANSWER" : "EXPLANATION / ANSWER";

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139); // slate-500
        const qTitleText = qLabel;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        const qLines = doc.splitTextToSize(item.front, contentWidth - 10);
        const qHeight = (qLines.length * 7) + 10;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const aLines = doc.splitTextToSize(item.back, contentWidth - 10);
        const aHeight = (aLines.length * 6) + 10;

        const totalItemHeight = qHeight + aHeight + 15;

        // Page break check
        if (y + totalItemHeight > 270) {
            doc.addPage();
            y = 25;
        }

        // Draw Item Container (Subtle for documents, boxed for flashcards)
        if (type === 'flashcards') {
            doc.setDrawColor(241, 245, 249);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(margin - 2, y - 5, contentWidth + 4, totalItemHeight, 3, 3, 'FD');
        }

        // Question header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(type === 'flashcards' ? 148 : 37, type === 'flashcards' ? 163 : 99, type === 'flashcards' ? 184 : 235); // colored label for docs
        doc.text(qTitleText, margin + 2, y + 2);

        // Question text
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text(qLines, margin + 2, y + 10);

        y += qHeight + 5;

        // Divider
        doc.setDrawColor(226, 232, 240);
        doc.line(margin + 2, y - 2, pageWidth - margin - 2, y - 2);

        // Answer header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(aLabel, margin + 2, y + 4);

        // Answer text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85); // slate-700
        doc.text(aLines, margin + 2, y + 11);

        y += aHeight + 15;
    });

    doc.save(filename);
};

/**
 * Export to Word (.docx) - Table format
 */
export const exportToWord = async (flashcards: FlashcardData[], filename = 'flashcards.docx') => {

    const tableRows = flashcards.map(card =>
        new TableRow({
            children: [
                new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: card.front, bold: true })] })],
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [new Paragraph(card.back)],
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
            ],
        })
    );

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [new TextRun({ text: "Flashcards Set", size: 32, bold: true })],
                    spacing: { after: 400 },
                }),
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Term / Question", bold: true })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Definition / Answer", bold: true })] })] }),
                            ],
                        }),
                        ...tableRows
                    ],
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    }
                }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};
