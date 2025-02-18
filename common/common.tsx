export function formatDate(dateString: string): string {
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