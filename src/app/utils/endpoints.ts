import { EnvService } from '../env.service';

let env = new EnvService();

export const END_POINTS = {

    terminos: {
        terminos: '/terminos/verificarterminos',
        aceptartermino: '/terminos/aceptartermino',
        consultaterminos: '/terminos/consultaterminos'
    },
    file_system: {
        url: '/file/downloadfile?fileName=',
    },
    obtener_token: {
        url: 'http://desweblogic2.indecopi.gob.pe:10000/appTodosServicioAutorizacion/oauth/token'
    },
    registro: {
        solicitud: '/solicitud/solicitar/',
        consulta_lista_general: '/generico/lstgenericos', //Consulta Listas general
        ubigeo_paises: '/ubigeo/paises',
        ubigeo_departamento: '/ubigeo/departamentos',
        ubigeo_provincia: '/ubigeo/provincias',
        ubigeo_distrito: '/ubigeo/distritos',
        usuario_sel: '/usuario/usuario',
        subir_archivo: '/file/uploadfile',
        valida_pago: '/tramite/validapago',
    },
    pide: { 
        consulta_reniec: '/pide/consultareniec',
        consulta_migraciones: '/pide/consultamigraciones',
    },
    arancel: {
        consulta_simple: '/aranceles/busquedasimple',
    }
};
