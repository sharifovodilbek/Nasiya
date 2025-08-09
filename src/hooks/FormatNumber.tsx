export const FormatNumber = (num: string | number) => `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
