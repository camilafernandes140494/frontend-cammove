import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import {
	Button,
	Dialog,
	Divider,
	Portal,
	Switch,
	Text,
} from "react-native-paper";

const TermsScreen = ({ navigation }: any) => {
	const [accepted, setAccepted] = useState(false);
	const [visible, setVisible] = useState(false);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	const handleAccept = () => {
		setAccepted(true);
		hideModal();
	};

	return (
		<>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					marginHorizontal: 12,
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text variant="labelLarge">Li e aceito os</Text>
					<Button
						onPress={showModal}
						mode="text"
						compact
						contentStyle={{ padding: 0 }}
					>
						Termos de Uso
					</Button>
				</View>

				<View style={{ transform: [{ scale: 0.8 }] }}>
					<Switch
						value={accepted}
						onValueChange={() => setAccepted(!accepted)}
					/>
				</View>
			</View>

			<Portal>
				<Dialog onDismiss={hideModal} visible={visible}>
					<Dialog.Title>📄 Termos de Uso</Dialog.Title>
					<Dialog.ScrollArea>
						<ScrollView style={{ maxHeight: 400 }}>
							<Text>
								Bem-vindo(a) ao{" "}
								<Text variant="titleMedium" style={{ fontWeight: "bold" }}>
									CamMove
								</Text>
								!
							</Text>
							<Text style={{ marginTop: 10 }}>
								Estes Termos de Uso regulam o uso da plataforma por Professores
								e Alunos.
							</Text>

							<Divider style={{ marginVertical: 10 }} />

							<Text variant="titleMedium" style={{ marginBottom: 10 }}>
								⚖️ Seção Geral
							</Text>
							<Text>
								- É obrigatório fornecer informações verdadeiras e atualizadas
								ao criar a conta.{"\n"}- Cada usuário é responsável por manter a
								confidencialidade de seus dados de acesso (login e senha).{"\n"}
								- Professores devem cadastrar corretamente seus alunos e
								gerenciar informações disponibilizadas.{"\n"}- O usuário deve
								informar imediatamente caso perceba uso não autorizado de sua
								conta.
							</Text>

							<Divider style={{ marginVertical: 10 }} />

							<Text variant="titleMedium" style={{ marginBottom: 10 }}>
								🛡 Coleta e Uso de Dados (LGPD)
							</Text>
							<Text>
								- Coletamos e-mail e telefone para cadastro, notificações e
								envio de avaliações físicas.{"\n"}- Dados são utilizados apenas
								para fins relacionados ao funcionamento da plataforma.{"\n"}- O
								acesso aos dados é restrito: professores só veem os dados de
								seus alunos; alunos só veem seus próprios dados.{"\n"}- O
								usuário pode solicitar correção ou exclusão de seus dados a
								qualquer momento.
								{"\n"}- Para mais informações, consulte nossa Política de
								Privacidade.
							</Text>

							<Divider style={{ marginVertical: 10 }} />

							<Text variant="titleMedium" style={{ marginBottom: 10 }}>
								👨‍🏫 Professores
							</Text>
							<Text>
								- Criar, editar, visualizar e excluir treinos, avaliações
								físicas, exercícios, agendamentos e alunos.{"\n"}- Envio
								automático de notificações e e-mails relacionados às avaliações
								físicas e agendamentos.
							</Text>

							<Divider style={{ marginVertical: 10 }} />

							<Text variant="titleMedium" style={{ marginBottom: 10 }}>
								🏋️ Alunos
							</Text>
							<Text>
								- Visualizar e avaliar treinos.{"\n"}- Visualizar avaliações
								físicas.{"\n"}- Visualizar agendamentos e inscrever-se em
								atividades de interesse.{"\n"}- Receber notificações e e-mails
								enviados pelo professor.
							</Text>

							<Divider style={{ marginVertical: 10 }} />

							<Text variant="titleMedium" style={{ marginBottom: 10 }}>
								📌 Responsabilidades do Usuário
							</Text>
							<Text>
								- Utilizar a plataforma de forma ética e legal, sem prejudicar
								terceiros.{"\n"}- Não compartilhar dados de login ou informações
								de outros usuários.{"\n"}- Professores são responsáveis pela
								veracidade e atualização das informações cadastradas.{"\n"}-
								Alunos são responsáveis pelo uso correto das informações
								disponíveis.
							</Text>

							<Divider style={{ marginVertical: 10 }} />

							<Text variant="titleMedium" style={{ marginBottom: 10 }}>
								⚠️ Limitação de Responsabilidade
							</Text>
							<Text>
								- O{" "}
								<Text variant="titleMedium" style={{ fontWeight: "bold" }}>
									CamMove
								</Text>{" "}
								atua apenas como ferramenta de gestão e acompanhamento; não
								substitui orientação médica ou diagnóstico profissional.{"\n"}-
								O uso das informações fornecidas é de responsabilidade exclusiva
								do professor e do aluno.{"\n"}- A plataforma não se
								responsabiliza por danos decorrentes de uso indevido ou não
								autorizado do app.
							</Text>

							<Divider style={{ marginVertical: 10 }} />

							<Text variant="titleMedium" style={{ marginBottom: 10 }}>
								🔔 Notificações e E-mails
							</Text>
							<Text>
								- A plataforma pode enviar notificações push e e-mails
								automáticos relacionados a treinos, avaliações e agendamentos.
								{"\n"}- O usuário pode gerenciar suas preferências de
								notificações no dispositivo.
							</Text>

							<Divider style={{ marginVertical: 10 }} />

							<Text variant="titleMedium" style={{ marginBottom: 10 }}>
								✏️ Alterações nos Termos
							</Text>
							<Text>
								- Estes Termos de Uso podem ser alterados a qualquer momento.
								{"\n"}- Alterações relevantes serão comunicadas por e-mail ou
								pelo app.{"\n"}- O uso contínuo da plataforma após atualização
								significa aceitação dos novos termos.
							</Text>

							<Divider style={{ marginVertical: 10 }} />

							<Text variant="titleMedium" style={{ marginBottom: 10 }}>
								📸 Uso de Imagem e Conteúdo do Usuário
							</Text>
							<Text>
								- Professores e alunos podem enviar fotos ou imagens
								relacionadas ao treino e avaliação física.{"\n"}- Ao enviar
								imagens, o usuário autoriza o{" "}
								<Text style={{ fontWeight: "bold" }}>CamMove</Text> a utilizar
								essas imagens em materiais de divulgação, publicidade e
								campanhas de marketing do aplicativo, sem necessidade de
								pagamento ou autorização adicional.{"\n"}- O{" "}
								<Text style={{ fontWeight: "bold" }}>CamMove</Text> não se
								responsabiliza por imagens enviadas pelos usuários que sejam
								inadequadas ou violem direitos de terceiros.{"\n"}- Os usuários
								devem garantir que têm direito de compartilhar as imagens e que
								elas não violam leis vigentes.{"\n"}- Qualquer conteúdo
								inadequado, ofensivo ou ilegal deve ser reportado ao responsável
								pela plataforma.
							</Text>

							<Divider style={{ marginVertical: 10 }} />

							<Text variant="titleMedium" style={{ marginBottom: 10 }}>
								❌ Encerramento de Conta
							</Text>
							<Text>
								- O usuário pode solicitar encerramento de sua conta a qualquer
								momento.{"\n"}- O{" "}
								<Text variant="titleMedium" style={{ fontWeight: "bold" }}>
									CamMove
								</Text>{" "}
								pode suspender ou excluir contas que violem estes Termos de Uso.
							</Text>

							<Divider style={{ marginVertical: 10 }} />

							<Text variant="titleMedium" style={{ marginBottom: 10 }}>
								📬 Contato
							</Text>
							<Text>
								Em caso de dúvidas sobre estes Termos, entre em contato pelo
								e-mail:{" "}
								<Text variant="titleMedium" style={{ fontWeight: "bold" }}>
									app.cammove@gmail.com
								</Text>
							</Text>
						</ScrollView>
					</Dialog.ScrollArea>
					<Dialog.Actions>
						<Button onPress={hideModal}>Fechar</Button>
						<Button onPress={handleAccept}>Aceitar</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};

export default TermsScreen;
