// Definindo o tipo para a avaliação física
type BodyMeasurements = {
  weight?: number;
  height?: number;
  bodyFatPercentage?: number;
  imc?: number | string;
  waistCircumference?: number;
  hipCircumference?: number;
  chestCircumference?: number;
  rightArmCircumference?: number;
  leftArmCircumference?: number;
  rightThighCircumference?: number;
  leftThighCircumference?: number;
  rightCalfCircumference?: number;
  leftCalfCircumference?: number;
  neckCircumference?: number;
};

type BodyMass = {
  muscleMass?: number;
  boneMass?: number;
};

type PhysicalTests = {
  pushUpTest?: number | string;
  squatTest?: number | string;
  flexibilityTest?: number | string;
  cooperTestDistance?: number | string;
};

type HeartRate = {
  restingHeartRate?: number;
  maxHeartRate?: number;
};

type BalanceAndMobility = {
  balanceTest?: any;
  mobilityTest?: any;
};

type Posture = {
  postureAssessment?: any;
};

type MedicalHistory = {
  injuryHistory?: number | string;
  medicalConditions?: number | string;
  chronicPain?: number | string;
};

export type AssessmentData = {
  // Medições Corporais
  studentName?: number | string;
  studentId?: number | string;

  bodyMeasurements?: BodyMeasurements;

  // Massa Corporal
  bodyMass: BodyMass;

  // Testes Físicos
  physicalTests?: PhysicalTests;

  // Frequência Cardíaca
  heartRate?: HeartRate;

  // Avaliações de Equilíbrio e Mobilidade
  balanceAndMobility?: BalanceAndMobility;

  // Postura
  posture?: Posture;

  // Histórico de Lesões e Condições Médicas
  medicalHistory?: MedicalHistory;

  // Objetivos de Fitness
  fitnessGoals?: string;

  observations?: string;
  // Data da avaliação
  assessmentDate?: string;
};
