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
export const exportToPDF = (flashcards: FlashcardData[], filename = 'flashcards.pdf') => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text("Flashcards Study Set", margin, 25);

    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(margin, 30, pageWidth - margin, 30);

    let y = 45;

    flashcards.forEach((card) => {
        // Calculate heights
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        const questionLabel = "QUESTION";

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        const questionLines = doc.splitTextToSize(card.front, contentWidth - 10);
        const questionHeight = (questionLines.length * 7) + 5;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        const answerLabel = "ANSWER";

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const answerLines = doc.splitTextToSize(card.back, contentWidth - 10);
        const answerHeight = (answerLines.length * 6) + 5;

        const totalCardHeight = questionHeight + answerHeight + 25;

        // Check for page break
        if (y + totalCardHeight > 270) {
            doc.addPage();
            y = 25;
        }

        // Card Box
        doc.setDrawColor(241, 245, 249); // slate-100
        doc.setFillColor(248, 250, 252); // slate-50
        doc.roundedRect(margin - 2, y - 5, contentWidth + 4, totalCardHeight, 3, 3, 'FD');

        // Question
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(questionLabel, margin + 2, y + 2);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text(questionLines, margin + 2, y + 10);

        y += questionHeight + 8;

        // Divider
        doc.setDrawColor(226, 232, 240);
        doc.line(margin + 2, y - 2, pageWidth - margin - 2, y - 2);

        // Answer
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(answerLabel, margin + 2, y + 5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85); // slate-700
        doc.text(answerLines, margin + 2, y + 12);

        y += answerHeight + 15;
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
