import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

pdfMake.vfs = pdfFonts.vfs;

const GeneratePDFBase64 = async (tableData?: string[][]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Avaliação fisica', fontSize: 14, margin: [0, 10, 0, 0], alignment: 'center', },
        {
          table: {
            headerRows: 1, // número de linhas de cabeçalho
            widths: ['*', '*'], // define a largura das colunas
            body: [
              ...tableData ?? [],  // Espalha o conteúdo da tabela recebido como argumento
            ],
          },
        },
      ],
      footer: (currentPage: number, pageCount: number) => [
        {
          text: `Desenvolvido por Cammove - Página ${currentPage} de ${pageCount}`,
          alignment: 'center',
          fontSize: 10,
          margin: [0, 10, 0, 0],
        },
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
