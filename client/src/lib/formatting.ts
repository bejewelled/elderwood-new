

export const f  = (n: any, pl: number = 0) =>  {
    if (isNaN(Number(n))) return n;
    if (!pl) pl = 0
    if (isNaN(n)) return "???"
    if (n < 1e9) return n.toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    else return n.toExponential(3).toString().replace('+', '');
}   

export const fp = (n: any, pl = 2, subOne = false) => {
    if (isNaN(Number(n))) return n;
    if (!pl) pl = 0
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
}

export const cap = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}