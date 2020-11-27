import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GlobalService {

    constructor() { }

    objData: any = {};
    objListasGlobales: any = {};
    nuProceso: number;
    vcCodArancel: string;
    vcCodUsuarioSel: string;
    vcAccessToken: string;
    _nuIdUsuarioSel: number;
    _nuIdTipoOrigen: number;
    _nuIdTipoDocumento: number;
    _vcCorreo: string;
    _nuIdTipoObra: number;
    _objTerminos: any;
    _vcMontoArancel: string;
    _nuFlagAlta:number;

    /**/
    _nuOrigen: number = 0;
    _nuDestino: number = 0;
    /**/

    obtenerData() {
        //console.log('data: ' + JSON.stringify(this.objData, null, 2));
        return this.objData;
    }

    agregarDataGenerica(vcUsuario: any, nuProceso: any): void {
        this.objData.vcUsuario = vcUsuario;
        this.objData.nuProceso = nuProceso;
    }

    agregarPersona(obj: any): void {
        this.objData['lstPersona'] = obj;
    }

    agregarObra(obj: any): void {
        this.objData['objObra'] = obj;
    }

    agregarArchivo(obj: any): void {
        this.objData['lstArchivo'] = obj;
    }

    agregarPago(obj: any): void {
        this.objData['objPago'] = obj;
    }

    /*Otros*/
    get listasGlobales(): any {
        return this.objListasGlobales;
    }

    set listasGlobales(obj: any) {
        this.objListasGlobales = obj;
    }

    get nroProceso(): number {
        return this.nuProceso;
    }

    set nroProceso(nuProceso: number) {
        this.nuProceso = nuProceso;
    }

    get codArancel(): string {
        return this.vcCodArancel;
    }

    set codArancel(vcCodArancel: string) {
        this.vcCodArancel = vcCodArancel;
    }

    get codUsuarioSel(): string {
        return this.vcCodUsuarioSel;
    }

    set codUsuarioSel(vcCodUsuarioSel: string) {
        this.vcCodUsuarioSel = vcCodUsuarioSel;
    }

    get nuIdUsuarioSel(): number {
        return this._nuIdUsuarioSel;
    }

    set nuIdUsuarioSel(_nuIdUsuarioSel: number) {
        this._nuIdUsuarioSel = _nuIdUsuarioSel;
    }

    get codAccessToken(): string {
        return this.vcAccessToken;
    }

    set codAccessToken(vcAccessToken: string) {
        this.vcAccessToken = vcAccessToken;
    }

    get nuIdTipoOrigen(): number {
        return this._nuIdTipoOrigen;
    }

    set nuIdTipoOrigen(_nuIdTipoOrigen: number) {
        this._nuIdTipoOrigen = _nuIdTipoOrigen;
    }

    get nuIdTipoDocumento(): number {
        return this._nuIdTipoDocumento;
    }

    set nuIdTipoDocumento(_nuIdTipoDocumento: number) {
        this._nuIdTipoDocumento = _nuIdTipoDocumento;
    }

    get vcCorreo(): string {
        return this._vcCorreo;
    }

    set vcCorreo(_vcCorreo: string) {
        this._vcCorreo = _vcCorreo;
    }

    get nuIdTipoObra(): number {
        return this._nuIdTipoObra;
    }

    set nuIdTipoObra(_nuIdTipoObra: number) {
        this._nuIdTipoObra = _nuIdTipoObra;
    }

    get nuOrigen(): number {
        return this._nuOrigen;
    }

    set nuOrigen(_nuOrigen: number) {
        this._nuOrigen = _nuOrigen;
    }

    get nuDestino(): number {
        return this._nuDestino;
    }

    set nuDestino(_nuDestino: number) {
        this._nuDestino = _nuDestino;
    }

    get objTerminos(): any {
        return this._objTerminos;
    }

    set objTerminos(_objTerminos: any) {
        this._objTerminos = _objTerminos;
    }

    get montoArancel(): string {
        return this._vcMontoArancel;
    }

    set montoArancel(_vcMontoArancel: string) {
        this._vcMontoArancel = _vcMontoArancel;
    }

    get nuFlagAlta(): number {
        return this._nuFlagAlta;
    }

    set nuFlagAlta(_nuFlagAlta: number) {
        this._nuFlagAlta = _nuFlagAlta;
    }
    /*Otros*/
}