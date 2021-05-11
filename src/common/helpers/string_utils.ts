export function gfhasSymbols(str: string): boolean {
    return /[!@#$%^&*()_+-={}\|;':",./<>?]/.test(str);
}

export function gfhasDigits(str: string): boolean {
    return /[0-9]/.test(str);
}