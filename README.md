# Welcome CAMMOVE app 👋💕

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

Node 20
In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

O aplicativo é uma plataforma inovadora que conecta personal trainers a seus alunos, oferecendo uma experiência completa de acompanhamento e gestão de treinos.

Funcionalidades principais:
Cadastro de Personal Trainers e Alunos: Profissionais podem se registrar e gerenciar seus alunos de forma prática.
Criação de Treinos Personalizados: Os professores podem montar planos de treino sob medida, adaptando exercícios conforme a necessidade de cada aluno.
Registro de Exercícios: Possibilidade de cadastrar e organizar exercícios com detalhes como nome, categoria, tempo, repetições e carga.
Avaliações Físicas: Os personais podem registrar e acompanhar métricas de desempenho e evolução dos alunos ao longo do tempo.
Facilidade de Acompanhamento: Alunos têm acesso aos treinos e avaliações diretamente pelo aplicativo, tornando o processo mais dinâmico e acessível.
A plataforma facilita a rotina dos profissionais da área fitness, tornando o acompanhamento mais eficiente e promovendo uma experiência mais personalizada para cada aluno.
. Cabeçalho (Header)
Nome do Personal Trainer e um avatar (ou foto).
Ícone de notificações (ex: lembretes, pedidos de alunos, treinos vencendo).
Campo de pesquisa para encontrar alunos rapidamente.
Seção de Alunos (Lista ou Cards)

Nome e foto do aluno.
Status do treino (ativo, em pausa, concluído).
Última avaliação física (data e resumo).
Botão "Acessar Treinos" para visualizar ou criar novos treinos.
Ícone de chat (se houver uma funcionalidade de mensagens).
🔹 Filtros para organizar a lista por:

Nome
Nível (iniciante, intermediário, avançado)
Objetivo (hipertrofia, emagrecimento, condicionamento)
Status do treino 3. Insights e Estatísticas
Essa área ajuda o professor a acompanhar o progresso dos alunos e identificar pontos de atenção.

📊 Indicadores-chave:

Total de alunos ativos.
Alunos sem treino recente (por mais de X dias).
Média de treinos concluídos por aluno na semana.
Últimas avaliações físicas realizadas.
Gráficos de progresso de alunos (opcional). 4. Acesso Rápido e Ações
Para tornar a navegação mais prática, a Home pode incluir atalhos:

"Criar novo treino" (leva direto para criação de treinos).
"Ver avaliações físicas" (acessa histórico de avaliações).
"Treinos recentes" (lista os últimos treinos editados).
"Relatórios de desempenho" (caso tenha estatísticas avançadas).
Essa estrutura garante que o professor possa visualizar rapidamente seus alunos, gerenciar treinos de forma eficiente e ter insights úteis para melhorar o acompanhamento. 🚀
// Exemplo de estrutura de diretórios:
src/
├── navigation/
│ ├── RootNavigator.tsx
│ ├── AuthNavigator.tsx
│ ├── HomeNavigator.tsx
│ ├── WorkoutsNavigator.tsx
│ └── ExercisesNavigator.tsx
├── screens/
│ ├── auth/
│ │ ├── Login.tsx
│ │ ├── Register.tsx
│ ├── home/
│ │ ├── Home.tsx
│ ├── workouts/
│ │ ├── Workouts.tsx
│ ├── exercises/
│ │ ├── Exercises.tsx
│ │ ├── CreateExercise.tsx
└── ...

Para um commit em inglês enquanto ainda está trabalhando na tela, algo genérico e claro pode ser:

🔹 "WIP: working on screen layout" (se estiver ajustando o layout)
🔹 "WIP: implementing screen components" (se estiver desenvolvendo os componentes)
🔹 "WIP: refining screen behavior" (se estiver ajustando a lógica ou interações)
🔹 "WIP: ongoing development for [screen name]" (se quiser algo mais abrangente)

O "WIP" (Work In Progress) indica que o trabalho ainda não está finalizado.
