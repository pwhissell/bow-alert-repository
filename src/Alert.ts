export interface Alert {
    topic: string,
    min?: number | null,
    max?: number | null
}

export const AlertConfig = {
    TABLE_NAME: 'ALERT'
}