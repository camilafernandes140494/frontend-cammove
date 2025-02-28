import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

const GeneratePDFBase64 = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const docDefinition = {
      content: [
        { text: 'Este é um PDF gerado automaticamente!', fontSize: 14 },
      ],
    };

    const pdfDoc = pdfMake.createPdf(docDefinition);

    pdfDoc.getBase64((base64) => {
      if (base64) {
        resolve(base64);
      } else {
        reject(new Error('Erro ao gerar o PDF'));
      }
    });
  });
};

export default GeneratePDFBase64;
