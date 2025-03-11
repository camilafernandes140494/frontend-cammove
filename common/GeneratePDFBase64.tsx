import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { calculateAge } from './common';
import { Users } from '@/api/users/users.types';

pdfMake.vfs = pdfFonts.vfs;

const GeneratePDFBase64 = async (body?: string, student?: Users): Promise<string> => {
  return new Promise((resolve, reject) => {

    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Avaliação fisica', fontSize: 16, margin: 10, alignment: 'center', },
        { text: `Aluno(a): ${student?.name}`, fontSize: 12, marginTop: 10, },
        { text: `Gênero: ${student?.gender} | ${calculateAge(student?.birthDate || '')}`, fontSize: 12, marginBottom: 10, },
        { text: body ?? '', fontSize: 10, margin: 10, },
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
