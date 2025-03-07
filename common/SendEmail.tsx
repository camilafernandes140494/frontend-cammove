import Mailer from 'react-native-mail';

const SendEmail = (
  to: string[],
  subject: string,
  body: string,
  attachments?: { base64: string; name: string }[]
) => {
  console.log(Mailer, 'MailerMailer')
  return new Promise<void>((resolve, reject) => {
    if (!Mailer) {
      reject(new Error('Mailer não disponível.'));
      return;
    }

    Mailer.mail(
      {
        subject,
        recipients: to,
        body,
        isHTML: true,
        attachments: attachments?.map((file) => ({
          path: `data:application/pdf;base64,${file.base64}`,
          type: 'pdf',
          name: file.name,
        })),
      },
      (error, event) => {
        if (error) {
          console.error('Erro ao enviar e-mail:', error);
          reject(error);
        } else {
          console.log('E-mail enviado com sucesso!', event);
          resolve();
        }
      }
    );
  });
};

export default SendEmail;
