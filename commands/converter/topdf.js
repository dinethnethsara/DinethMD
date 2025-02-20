const fs = require('fs');
const path = require('path');
const libre = require('libreoffice-convert');
const util = require('util');
const config = require('../../config');

// Convert to promise
const convertAsync = util.promisify(libre.convert);

module.exports = async (sock, msg) => {
    const sender = msg.key.remoteJid;
    
    try {
        const messageType = Object.keys(msg.message)[0];
        
        // Check if message has a document
        if (messageType !== 'documentMessage') {
            await sock.sendMessage(sender, { text: '❌ *Document to PDF Converter*\n\n• Please send a document (DOC/DOCX/TXT)\n• Use !topdf command as caption\n\n🤖 _Powered by Dineth MD_' });
            return;
        }

        const mimeType = msg.message[messageType].mimetype;
        const allowedMimes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

        if (!allowedMimes.includes(mimeType)) {
            await sock.sendMessage(sender, { text: '❌ *Unsupported File Format*\n\n• Only DOC, DOCX, and TXT files are supported\n• Please try again with correct format\n\n🤖 _Powered by Dineth MD_' });
            return;
        }

        // Send processing message
        await sock.sendMessage(sender, { text: '⏳ *PDF Conversion in Progress*\n\n• Converting your document to PDF\n• Please wait a moment...\n\n🤖 _Powered by Dineth MD_' });

        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Download document
        const docData = await sock.downloadMediaMessage(msg);
        const docPath = path.join(tempDir, `${Date.now()}.${mimeType.split('/')[1]}`);
        fs.writeFileSync(docPath, docData);

        // Convert to PDF
        const pdfBuf = await convertAsync(docData, '.pdf', undefined);
        const outputPath = path.join(tempDir, `${Date.now()}.pdf`);
        fs.writeFileSync(outputPath, pdfBuf);

        // Send PDF
        await sock.sendMessage(sender, { 
            document: fs.readFileSync(outputPath),
            mimetype: 'application/pdf',
            fileName: 'converted.pdf',
            caption: `📄 *PDF Conversion Complete*\n\n• File successfully converted\n• Format: PDF\n\n🤖 _Powered by Dineth MD_`
        });

        // Clean up temp files
        fs.unlinkSync(docPath);
        fs.unlinkSync(outputPath);

    } catch (error) {
        console.error('Error in topdf command:', error);
        await sock.sendMessage(sender, { text: '❌ *Conversion Error*\n\n• An error occurred during conversion\n• Please try again later\n\n🤖 _Powered by Dineth MD_' });
    }
};