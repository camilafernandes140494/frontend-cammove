import Mailer from "react-native-mail";

const SendEmail = (
	to: string[],
	subject: string,
	body: string,
	attachments?: { base64: string; name: string }[],
) => {
	return new Promise<void>((resolve, reject) => {
		if (!Mailer) {
			reject(new Error("Mailer não disponível."));
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
					type: "pdf",
					name: file.name,
				})),
			},
			(error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			},
		);
	});
};

export default SendEmail;
