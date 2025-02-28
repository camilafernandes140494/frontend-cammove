type Attachment = {
  filename: string;
  content: string; // Conteúdo em base64 (string)
  encoding: 'base64'; // Aceita apenas 'base64'
};

export type PostEmail = {
  to: string[];
  subject: string;
  body: string;
  attachments?: Attachment[]; // Lista de anexos com o tipo correto
};
