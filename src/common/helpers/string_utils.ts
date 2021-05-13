export function gfhasSymbols(str: string): boolean {
    return /[!@#$%^&*()_+-={}\|;':",./<>?]/.test(str);
}

export function gfhasDigits(str: string): boolean {
    return /[0-9]/.test(str);
}

export function gfoffsetString(str: string, offset: number) {    
    let r: string = "";

    for(const ch of str) {
        const ascii: number = ch.charCodeAt(0);
        r += String.fromCharCode(ascii + offset);
    }

    return r;    
}