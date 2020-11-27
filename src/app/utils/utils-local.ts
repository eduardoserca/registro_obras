export class UtilsLocal {
    constructor() { }

    public convertirFecha(date: any): String {
        const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const mes = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        const ano = date.getFullYear();
        return ano + '-' + mes + '-' + dia;
    }
}
