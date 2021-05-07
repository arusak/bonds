export function formatCurrency(value: number, digits = 2) {
    return value.toLocaleString('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function formatMillions(value: number) {
    let millions = value / 1000000;
    return (millions >= 0.1 ? formatCurrency(millions, 1) : '< 0,1') + ' млн.';
}
