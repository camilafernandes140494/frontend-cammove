export function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function getNextMonth(dateString: string): string {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export type DateStatus = 'INVALID_DATE' | 'TODAY' | 'UPCOMING' | 'PAST' | 'FUTURE';

export function checkDateStatus(dateString: string): DateStatus {
    const hoje = new Date();
    const targetDate = new Date(dateString); // Converte a string para um objeto Date

    // Verifica se a conversão da data foi bem-sucedida
    if (isNaN(targetDate.getTime())) {
        return 'INVALID_DATE';
    }

    const diffTime = targetDate.getTime() - hoje.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays === 0) {
        return 'TODAY';
    } else if (diffDays > 0 && diffDays <= 5) {
        return 'UPCOMING';
    } else if (diffDays < 0) {
        return 'PAST';
    } else {
        return 'FUTURE';
    }
}

export const getInitials = (name: string): string => {
    if (!name) return "";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }

    const firstLetter = words[0].charAt(0);
    const lastLetter = words[words.length - 1].charAt(0);

    return (firstLetter + lastLetter).toUpperCase();
};

export const getGender = (gender: string) => {
    switch (gender) {
        case 'MALE':
            return "Masculino"
        case 'FEMALE':
            return "Feminino"
        case 'OTHER':
            return "Outro"
        case 'PREFER_NOT_TO_SAY':
            return "Prefiro não me identificar"
        default:
            return "Não especificado";
    }
};

export const calculateAge = (birthdate: string | Date): number => {
    const birth = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    // Ajusta a idade se ainda não fez aniversário no ano atual
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
};

type IMCCategory =
    | "Abaixo do peso"
    | "Peso normal"
    | "Sobrepeso"
    | "Obesidade grau 1"
    | "Obesidade grau 2"
    | "Obesidade grau 3"
    | 'Não definido';

export function calculateIMC(peso: number, altura: number): { imc: number; categoria: IMCCategory } {
    let categoria: IMCCategory;
    const imc = Number((peso / (altura * altura)).toFixed(2));


    if (imc < 18.5) {
        categoria = "Abaixo do peso";
    } else if (imc < 24.9) {
        categoria = "Peso normal";
    } else if (imc < 29.9) {
        categoria = "Sobrepeso";
    } else if (imc < 34.9) {
        categoria = "Obesidade grau 1";
    } else if (imc < 39.9) {
        categoria = "Obesidade grau 2";
    } else {
        categoria = "Obesidade grau 3";
    }
    if (peso <= 0 || altura <= 0) {
        categoria = "Não definido";
    }

    return { imc, categoria };
}

