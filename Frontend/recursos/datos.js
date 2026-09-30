// Datos y utilidades compartidas por todas las páginas del sistema.
// Mientras no exista la base de datos en línea, aquí viven los trabajadores ficticios,
// de modo que todas las páginas muestran exactamente la misma información.

// =====================================================================
//  CONFIGURACIÓN (se edita en Configuración y se aplica en todo el sistema)
// =====================================================================
const CLAVE_CONFIGURACION = 'elnevado.configuracion.v1';

const CONFIGURACION_INICIAL = {
    // Políticas de asistencia
    toleranciaMinutos: 15,          // minutos después de las 08:00 que no cuentan como retardo
    retardosPermitidosSemana: 3,    // el siguiente retardo de la semana descuenta un día completo
    // Centro de nómina
    diaPago: 'Viernes',
    salarioMinimoDiario: 315.04,    // salario mínimo general 2026 (CONASAMI)
    // Alertas (0 = sin aviso)
    avisoVacacionesDias: 14,        // días de anticipación para avisar salidas y regresos de vacaciones
    avisoIncapacidadDias: 3         // días de anticipación para avisar el fin de una incapacidad
};

const CONFIGURACION = (() => {
    try {
        return { ...CONFIGURACION_INICIAL, ...JSON.parse(localStorage.getItem(CLAVE_CONFIGURACION) || '{}') };
    } catch (error) {
        return { ...CONFIGURACION_INICIAL };
    }
})();

function guardarConfiguracion(nueva) {
    try {
        localStorage.setItem(CLAVE_CONFIGURACION, JSON.stringify(nueva));
        return true;
    } catch (error) {
        console.warn('No se pudo guardar la configuración en este navegador:', error);
        return false;
    }
}

// Cuántos días completos se descuentan por los retardos de una semana
function diasDescontadosPorRetardos(retardosSemana) {
    return Math.floor(retardosSemana / (CONFIGURACION.retardosPermitidosSemana + 1));
}

// Datos generales de la empresa (se muestran en Información)
const EMPRESA = {
    razonSocial: 'Distribuidora El Nevado S.A. de C.V.',
    rfc: 'DENE-140305-AB',
    domicilioFiscal: 'Av. Industrial San Jerónimo #412, Toluca, Edo. Méx.',
    sucursalPrincipal: '00',
    horario: 'Lunes a viernes 08:00 – 17:00 · Sábado 08:00 – 14:00',
    periodoNomina: 'Semanal (sábado a viernes)'
};

// =====================================================================
//  CATÁLOGOS
// =====================================================================
// Usuario que tiene la sesión abierta. Solo el rol "admin" puede elegir la sucursal
// al dar de alta; cualquier otro rol queda fijo en su propia sucursal.
const USUARIO_ACTUAL = { nombre: 'Eduardo Gómez', rol: 'admin', sucursal: '00' };

const SUCURSALES = {
    '00': 'Oficina central',
    '01': 'Colón',
    '02': 'Pacífico',
    '03': 'Torres',
    '04': 'Temoaya',
    '05': 'Atlacomulco',
    '06': 'Huixquilucan',
    '07': 'Sica Store Atlacomulco',
    '08': 'Tenango',
    '10': 'Sica Store Mexicaltzingo',
    '11': 'Jilotepec',
    '12': 'San Pablo Autopan',
    '13': 'Santiago Tianguistenco'
};

// Sucursales agregadas desde Información (se guardan en el navegador)
const CLAVE_SUCURSALES = 'elnevado.sucursales.v1';
try {
    Object.assign(SUCURSALES, JSON.parse(localStorage.getItem(CLAVE_SUCURSALES) || '{}'));
} catch (error) {
    // Sin almacenamiento disponible: solo las sucursales de base
}

// Lista ordenada por clave. Ojo: Object.entries pondría "10"-"13" antes que "00"-"08"
function listaSucursales() {
    return Object.entries(SUCURSALES)
        .map(([clave, nombre]) => ({ clave, nombre }))
        .sort((a, b) => a.clave.localeCompare(b.clave));
}

function agregarSucursal(clave, nombre) {
    SUCURSALES[clave] = nombre;
    try {
        const guardadas = JSON.parse(localStorage.getItem(CLAVE_SUCURSALES) || '{}');
        guardadas[clave] = nombre;
        localStorage.setItem(CLAVE_SUCURSALES, JSON.stringify(guardadas));
        return true;
    } catch (error) {
        console.warn('No se pudo guardar la sucursal en este navegador:', error);
        return false;
    }
}

// Enteros = departamentos, decimales = puestos
const DEPARTAMENTOS = [
    { grupo: 'Oficina', clave: '00', nombre: 'Director general', puestos: [] },
    { grupo: 'Oficina', clave: '01', nombre: 'Coordinación ventas', puestos: [] },
    { grupo: 'Oficina', clave: '02', nombre: 'Coordinación sucursales', puestos: [] },
    { grupo: 'Oficina', clave: '03', nombre: 'Coordinación administrativo', puestos: [] },
    { grupo: 'Oficina', clave: '04', nombre: 'RH', puestos: [] },
    { grupo: 'Oficina', clave: '05', nombre: 'Contabilidad', puestos: [] },
    { grupo: 'Oficina', clave: '06', nombre: 'Facturación', puestos: [
        { clave: '6.1', nombre: 'Jefe de facturación' },
        { clave: '6.2', nombre: 'Auxiliar de facturación' },
        { clave: '6.3', nombre: 'Becario' }
    ] },
    { grupo: 'Oficina', clave: '07', nombre: 'Inventarios', puestos: [
        { clave: '7.1', nombre: 'Jefa de inventarios' },
        { clave: '7.2', nombre: 'Auxiliar en inventarios' }
    ] },
    { grupo: 'Oficina', clave: '08', nombre: 'Compras', puestos: [] },
    { grupo: 'Oficina', clave: '09', nombre: 'Logística', puestos: [] },
    { grupo: 'Oficina', clave: '10', nombre: 'Sistemas', puestos: [
        { clave: '10.1', nombre: 'Jefe de departamento' },
        { clave: '10.2', nombre: 'Empleado' },
        { clave: '10.3', nombre: 'Becario' }
    ] },
    { grupo: 'Traileros de empresa', clave: '11', nombre: 'Traileros de empresa', puestos: [] },
    { grupo: 'Bodegas', clave: '12', nombre: 'Admin general', puestos: [
        { clave: '12', nombre: 'Admin general' },
        { clave: '12.1', nombre: 'Ayudante de admin' }
    ] },
    { grupo: 'Bodegas', clave: '13', nombre: 'Almacenista', puestos: [] },
    { grupo: 'Bodegas', clave: '14', nombre: 'Montacargista', puestos: [] },
    { grupo: 'Bodegas', clave: '15', nombre: 'Operadores', puestos: [
        { clave: '15.1', nombre: 'Torton' },
        { clave: '15.2', nombre: 'Rabón' },
        { clave: '15.3', nombre: 'Camionetas' }
    ] },
    { grupo: 'Bodegas', clave: '16', nombre: 'Ayudante general', puestos: [] }
];

// Un departamento sin puestos decimales tiene un único puesto con su mismo nombre
function puestosDe(nombreDepto) {
    const depto = DEPARTAMENTOS.find((d) => d.nombre === nombreDepto);
    if (!depto) return [];
    return depto.puestos.length ? depto.puestos : [{ clave: depto.clave, nombre: depto.nombre }];
}

// Salario mínimo general 2026 (CONASAMI, vigente desde el 1 de enero de 2026).
// Todas las sucursales están en el Estado de México: aplica la zona general, no la frontera norte.
const SALARIO_MINIMO_DIARIO = CONFIGURACION.salarioMinimoDiario;
const SALARIO_MINIMO_SEMANAL = Math.round(SALARIO_MINIMO_DIARIO * 7 * 100) / 100; // 7 días: incluye el día de descanso

const MOTIVOS_BAJA = ['Renuncia voluntaria', 'Término de contrato', 'Abandono de trabajo', 'Despido justificado', 'Jubilación', 'Defunción'];

// =====================================================================
//  DATOS FICTICIOS (se reemplazarán por la base de datos en línea)
// =====================================================================
const EMPLEADOS = [
    { id: '0001', nombre: 'Juan Pérez López', suc: '00', depto: 'Director general', puesto: 'Director general', ingreso: '2015-02-02', telefono: '7221034567', curp: 'PELJ750312HMCRPN04', rfc: 'PELJ750312KT2', sueldo: 15000,
      vacaciones: [{ inicio: '2026-03-30', fin: '2026-04-04' }] },
    { id: '0002', nombre: 'Gabriela Ortiz Ramírez', suc: '00', depto: 'Coordinación ventas', puesto: 'Coordinación ventas', ingreso: '2019-06-17', telefono: '7221148820', curp: 'OIRG880921MMCRMB02', rfc: 'OIRG880921HB6', sueldo: 7800,
      vacaciones: [{ inicio: '2026-07-13', fin: '2026-07-18' }] },
    { id: '0003', nombre: 'Héctor Vargas Nava', suc: '00', depto: 'Coordinación sucursales', puesto: 'Coordinación sucursales', ingreso: '2018-01-08', telefono: '7221239901', curp: 'VANH830705HMCRVC09', rfc: 'VANH830705QW1', sueldo: 7800,
      vacaciones: [{ inicio: '2026-05-11', fin: '2026-05-16' }] },
    { id: '0004', nombre: 'Patricia Luna Contreras', suc: '00', depto: 'Coordinación administrativo', puesto: 'Coordinación administrativo', ingreso: '2020-03-02', telefono: '7221357744', curp: 'LUCP860114MMCNNT07', rfc: 'LUCP860114R39', sueldo: 7500 },
    { id: '0005', nombre: 'Eduardo Gómez Salinas', suc: '00', depto: 'RH', puesto: 'RH', ingreso: '2017-09-04', telefono: '7221460032', curp: 'GOSE800222HMCMLD01', rfc: 'GOSE800222N47', sueldo: 7000,
      vacaciones: [{ inicio: '2026-08-03', fin: '2026-08-08' }] },
    { id: '0006', nombre: 'Ana Morales Castillo', suc: '00', depto: 'Contabilidad', puesto: 'Contabilidad', ingreso: '2021-05-10', telefono: '7221572210', curp: 'MOCA920830MMCRSN05', rfc: 'MOCA920830L85', sueldo: 6000,
      incapacidades: [
          { tipo: 'Riesgo de trabajo', folio: 'IMSS-39102', inicio: '2025-03-10', dias: 5 },
          { tipo: 'Enfermedad general', folio: 'IMSS-45821', inicio: '2026-09-22', dias: 7 }
      ] },
    { id: '0007', nombre: 'Laura Medina Sánchez', suc: '00', depto: 'Facturación', puesto: 'Jefe de facturación', ingreso: '2020-08-18', telefono: '7221683345', curp: 'MESL900504MMCDNR08', rfc: 'MESL900504FG2', sueldo: 6200,
      vacaciones: [{ inicio: '2026-03-30', fin: '2026-04-04' }] },
    { id: '0008', nombre: 'Carlos Jiménez Ruiz', suc: '00', depto: 'Facturación', puesto: 'Auxiliar de facturación', ingreso: '2026-09-07', telefono: '7221790056', curp: 'JIRC990217HMCMZR03', rfc: 'JIRC990217AB4', sueldo: 3200 },
    { id: '0009', nombre: 'Sofía Reyes Domínguez', suc: '00', depto: 'Facturación', puesto: 'Becario', ingreso: '2026-09-21', telefono: '7221801167', curp: 'REDS030609MMCYMF06', rfc: 'REDS030609UX8', sueldo: 2400 },
    { id: '0010', nombre: 'Mariana Torres Aguilar', suc: '00', depto: 'Inventarios', puesto: 'Jefa de inventarios', ingreso: '2019-11-04', telefono: '7221912278', curp: 'TOAM870419MMCRGR01', rfc: 'TOAM870419PL3', sueldo: 6200,
      vacaciones: [{ inicio: '2026-06-15', fin: '2026-06-20' }, { inicio: '2025-12-22', fin: '2025-12-31' }] },
    { id: '0011', nombre: 'Luis Hernández Mejía', suc: '00', depto: 'Inventarios', puesto: 'Auxiliar en inventarios', ingreso: '2022-02-14', telefono: '7222023389', curp: 'HEML950126HMCRJS02', rfc: 'HEML950126D71', sueldo: 3500,
      vacaciones: [{ inicio: '2025-07-07', fin: '2025-07-19' }, { inicio: '2026-09-26', fin: '2026-10-03' }] },
    { id: '0012', nombre: 'Fernando Castro Molina', suc: '00', depto: 'Compras', puesto: 'Compras', ingreso: '2023-04-03', telefono: '7222134490', curp: 'CAMF910811HMCSLR05', rfc: 'CAMF910811JK9', sueldo: 4800,
      baja: { fecha: '2026-09-12', motivo: 'Renuncia voluntaria' } },
    { id: '0013', nombre: 'Ricardo Soto Hernández', suc: '00', depto: 'Logística', puesto: 'Logística', ingreso: '2021-10-11', telefono: '7222245501', curp: 'SOHR890303HMCTRC04', rfc: 'SOHR890303MN5', sueldo: 5000,
      permisos: [{ inicio: '2026-09-29', fin: '2026-09-29', goce: true, motivo: 'Trámite personal' }] },
    { id: '0014', nombre: 'Daniel Rojas Pineda', suc: '00', depto: 'Sistemas', puesto: 'Jefe de departamento', ingreso: '2020-01-13', telefono: '7222356612', curp: 'ROPD880916HMCJNN08', rfc: 'ROPD880916ZS2', sueldo: 6800,
      vacaciones: [{ inicio: '2026-07-20', fin: '2026-07-25' }] },
    { id: '0015', nombre: 'Andrea Cruz Velázquez', suc: '00', depto: 'Sistemas', puesto: 'Empleado', ingreso: '2026-08-03', telefono: '7222467723', curp: 'CUVA970728MMCRLN09', rfc: 'CUVA970728TT6', sueldo: 4200 },
    { id: '0016', nombre: 'Jorge Ramos Cabrera', suc: '00', depto: 'Sistemas', puesto: 'Becario', ingreso: '2026-09-14', telefono: '7222578834', curp: 'RACJ040115HMCMBR07', rfc: 'RACJ040115EE1', sueldo: 2400 },
    { id: '0017', nombre: 'Raúl Mendoza Ortega', suc: '00', depto: 'Traileros de empresa', puesto: 'Traileros de empresa', ingreso: '2016-05-23', telefono: '7222689945', curp: 'MEOR780610HMCNRL03', rfc: 'MEOR780610WQ4', sueldo: 7200,
      vacaciones: [{ inicio: '2026-04-13', fin: '2026-04-18' }] },
    { id: '0101', nombre: 'Verónica Silva Guzmán', suc: '01', depto: 'Admin general', puesto: 'Admin general', ingreso: '2018-07-02', telefono: '7222790056', curp: 'SIGV850227MMCLZR02', rfc: 'SIGV850227GH8', sueldo: 5200,
      vacaciones: [{ inicio: '2026-08-17', fin: '2026-08-22' }] },
    { id: '0102', nombre: 'Miguel Fuentes Reyes', suc: '01', depto: 'Almacenista', puesto: 'Almacenista', ingreso: '2022-06-06', telefono: '7222801167', curp: 'FURM930412HMCNYG05', rfc: 'FURM930412BC2', sueldo: 3400,
      vacaciones: [{ inicio: '2026-09-21', fin: '2026-09-30' }] },
    { id: '0103', nombre: 'Óscar Delgado Ríos', suc: '01', depto: 'Montacargista', puesto: 'Montacargista', ingreso: '2024-02-02', telefono: '7222912278', curp: 'DERO960905HMCLSS01', rfc: 'DERO960905HJ3', sueldo: 3600,
      baja: { fecha: '2026-08-20', motivo: 'Abandono de trabajo' } },
    { id: '0201', nombre: 'Rosa Navarro Campos', suc: '02', depto: 'Admin general', puesto: 'Ayudante de admin', ingreso: '2023-09-11', telefono: '7223023389', curp: 'NACR940718MMCVMS06', rfc: 'NACR940718PP7', sueldo: 3300,
      vacaciones: [{ inicio: '2026-06-01', fin: '2026-06-06' }] },
    { id: '0202', nombre: 'Alberto Peña Ibarra', suc: '02', depto: 'Operadores', puesto: 'Torton', ingreso: '2021-03-15', telefono: '7223134490', curp: 'PEIA870129HMCXBL08', rfc: 'PEIA870129RT5', sueldo: 4800,
      permisos: [{ inicio: '2026-09-28', fin: '2026-09-30', goce: false, motivo: 'Asunto familiar' }] },
    { id: '0301', nombre: 'Roberto Silva Guzmán', suc: '03', depto: 'Operadores', puesto: 'Rabón', ingreso: '2019-04-22', telefono: '7223245501', curp: 'SIGR860520HMCLZB04', rfc: 'SIGR860520YU9', sueldo: 4500,
      vacaciones: [{ inicio: '2026-10-12', fin: '2026-10-17' }] },
    { id: '0302', nombre: 'Claudia Estrada León', suc: '03', depto: 'Ayudante general', puesto: 'Ayudante general', ingreso: '2026-01-12', telefono: '7223356612', curp: 'EALC000301MMCSNL02', rfc: 'EALC000301KL6', sueldo: 2700,
      baja: { fecha: '2026-09-25', motivo: 'Término de contrato' } },
    { id: '0401', nombre: 'Tomás Guerrero Paz', suc: '04', depto: 'Almacenista', puesto: 'Almacenista', ingreso: '2025-05-19', telefono: '7223467723', curp: 'GUPT980214HMCRZM07', rfc: 'GUPT980214VB1', sueldo: 3200,
      permisos: [{ inicio: '2026-09-15', fin: '2026-09-15', goce: true, motivo: 'Cita médica' }] },
    { id: '0501', nombre: 'Diego Flores Martínez', suc: '05', depto: 'Montacargista', puesto: 'Montacargista', ingreso: '2023-11-06', telefono: '7123578834', curp: 'FOMD950817HMCLRG03', rfc: 'FOMD950817CX4', sueldo: 3600,
      incapacidades: [{ tipo: 'Riesgo de trabajo', folio: 'IMSS-44310', inicio: '2026-07-06', dias: 10 }] },
    { id: '0502', nombre: 'Karla Medina Bautista', suc: '05', depto: 'Admin general', puesto: 'Admin general', ingreso: '2020-10-05', telefono: '7123689945', curp: 'MEBK900403MMCDTR09', rfc: 'MEBK900403NM2', sueldo: 5200,
      vacaciones: [{ inicio: '2026-07-06', fin: '2026-07-11' }] },
    { id: '0601', nombre: 'Arturo Ponce Villa', suc: '06', depto: 'Operadores', puesto: 'Camionetas', ingreso: '2026-09-01', telefono: '5523790056', curp: 'POVA920611HMCNLR06', rfc: 'POVA920611SD8', sueldo: 3900 },
    { id: '0701', nombre: 'Brenda Salazar Cortés', suc: '07', depto: 'Admin general', puesto: 'Admin general', ingreso: '2024-08-12', telefono: '7123801167', curp: 'SACB960922MMCLRR01', rfc: 'SACB960922FF3', sueldo: 4900,
      vacaciones: [{ inicio: '2026-08-10', fin: '2026-08-15' }] },
    { id: '0801', nombre: 'Iván Cárdenas Lara', suc: '08', depto: 'Almacenista', puesto: 'Almacenista', ingreso: '2022-09-26', telefono: '7173912278', curp: 'CALI910130HMCRRV05', rfc: 'CALI910130GT7', sueldo: 3400,
      incapacidades: [{ tipo: 'Riesgo de trabajo', folio: 'IMSS-46102', inicio: '2026-09-18', dias: 15 }] },
    { id: '1001', nombre: 'Samuel Rosas Quintero', suc: '10', depto: 'Ayudante general', puesto: 'Ayudante general', ingreso: '2026-06-15', telefono: '7224023389', curp: 'ROQS020808HMCSNM02', rfc: 'ROQS020808JH5', sueldo: 2700,
      baja: { fecha: '2026-07-18', motivo: 'Renuncia voluntaria' } },
    { id: '1101', nombre: 'Adriana Montes Fierro', suc: '11', depto: 'Admin general', puesto: 'Admin general', ingreso: '2021-07-19', telefono: '7614134490', curp: 'MOFA890726MMCNRD04', rfc: 'MOFA890726QA6', sueldo: 5200,
      vacaciones: [{ inicio: '2026-09-07', fin: '2026-09-12' }] },
    { id: '1201', nombre: 'Julio Becerra Olvera', suc: '12', depto: 'Montacargista', puesto: 'Montacargista', ingreso: '2026-03-09', telefono: '7224245501', curp: 'BEOJ970304HMCCLL08', rfc: 'BEOJ970304WE2', sueldo: 3600 },
    { id: '1202', nombre: 'Gloria Pacheco Rivas', suc: '12', depto: 'Almacenista', puesto: 'Almacenista', ingreso: '2024-01-15', telefono: '7224356612', curp: 'PARG930915MMCCVL03', rfc: 'PARG930915UI4', sueldo: 3400,
      incapacidades: [{ tipo: 'Maternidad', folio: 'IMSS-46350', inicio: '2026-09-01', dias: 84 }] },
    { id: '1301', nombre: 'Manuel Ochoa Zamora', suc: '13', depto: 'Admin general', puesto: 'Admin general', ingreso: '2025-12-01', telefono: '7134467723', curp: 'OOZM880428HMCCMN01', rfc: 'OOZM880428OP9', sueldo: 4900 },
    { id: '1302', nombre: 'Teresa Aguirre Luna', suc: '13', depto: 'Ayudante general', puesto: 'Ayudante general', ingreso: '2025-02-10', telefono: '7134578834', curp: 'AULT990113MMCGNR06', rfc: 'AULT990113ZX3', sueldo: 2700,
      baja: { fecha: '2025-11-28', motivo: 'Despido justificado' } }
];

// ---------------------------------------------------------------------
//  Memoria local del navegador (solo mientras no exista la base de datos)
//  Lo que se registra en una página (altas, importaciones, vacaciones,
//  permisos, incapacidades, incidencias) se ve también en las demás.
//  Si se cambian los datos ficticios de arriba, sube la versión de la clave.
// ---------------------------------------------------------------------
const CLAVE_ALMACEN = 'elnevado.empleados.v2';

(function cargarCambiosGuardados() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_ALMACEN));
        if (Array.isArray(guardado) && guardado.length) EMPLEADOS.splice(0, EMPLEADOS.length, ...guardado);
    } catch (error) {
        // Sin almacenamiento disponible (navegación privada, bloqueo): se usan los datos ficticios
    }
})();

function guardarCambios() {
    try {
        localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(EMPLEADOS));
    } catch (error) {
        console.warn('No se pudieron guardar los cambios en este navegador:', error);
    }
}

// Borra todo lo registrado y vuelve a los datos ficticios originales
function restablecerDatosDemo() {
    try {
        localStorage.removeItem(CLAVE_ALMACEN);
        localStorage.removeItem(CLAVE_CONFIGURACION);
        localStorage.removeItem(CLAVE_SUCURSALES);
    } catch (error) {
        // nada que borrar
    }
    location.reload();
}

// =====================================================================
//  UTILIDADES DE FECHAS Y FORMATO
// =====================================================================
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const TOLERANCIA_MINUTOS = CONFIGURACION.toleranciaMinutos;

function fechaDesdeISO(iso) {
    const [anio, mes, dia] = iso.split('-').map(Number);
    return new Date(anio, mes - 1, dia, 12);
}

function aISO(fecha) {
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

function sumarDias(fecha, dias) {
    const resultado = new Date(fecha);
    resultado.setDate(resultado.getDate() + dias);
    return resultado;
}

function formatoFecha(iso) {
    const fecha = fechaDesdeISO(iso);
    return `${String(fecha.getDate()).padStart(2, '0')} ${MESES_CORTOS[fecha.getMonth()]} ${fecha.getFullYear()}`;
}

function formatoCorto(fecha) {
    return `${String(fecha.getDate()).padStart(2, '0')} ${MESES_CORTOS[fecha.getMonth()]}`;
}

function formatoDinero(valor) {
    return valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

function formatoTelefono(tel) {
    return tel && tel.length === 10 ? `${tel.slice(0, 3)} ${tel.slice(3, 6)} ${tel.slice(6)}` : (tel || '—');
}

function formatoHoras(horas) {
    return `${Number.isInteger(horas) ? horas : horas.toFixed(1)} h`;
}

function normalizar(texto) {
    return String(texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function escaparHtml(texto) {
    return String(texto ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function enRango(iso, inicio, fin) {
    return iso >= inicio && iso <= fin;
}

function diasEntre(inicioIso, finIso) {
    return Math.round((fechaDesdeISO(finIso) - fechaDesdeISO(inicioIso)) / 86400000) + 1;
}

const HOY = new Date();
HOY.setHours(12, 0, 0, 0);
const HOY_ISO = aISO(HOY);

// La semana de nómina empieza en sábado y termina en viernes
function inicioSemanaNomina(fecha) {
    return sumarDias(fecha, -((fecha.getDay() + 1) % 7));
}

// Semanas (sáb–vie) que tocan algún día del mes
function semanasDelMes(anio, mes) {
    const ultimoDia = new Date(anio, mes + 1, 0, 12);
    const semanas = [];
    let inicio = inicioSemanaNomina(new Date(anio, mes, 1, 12));
    while (inicio <= ultimoDia) {
        semanas.push({ inicio, fin: sumarDias(inicio, 6) });
        inicio = sumarDias(inicio, 7);
    }
    return semanas;
}

function etiquetaSemana(semana) {
    return `Sáb ${formatoCorto(semana.inicio)} – Vie ${formatoCorto(semana.fin)}`;
}

// =====================================================================
//  ESTADO DEL EMPLEADO
// =====================================================================
function finIncapacidad(incapacidad) {
    return aISO(sumarDias(fechaDesdeISO(incapacidad.inicio), incapacidad.dias - 1));
}

function vacacionEn(emp, iso) {
    return (emp.vacaciones || []).find((v) => enRango(iso, v.inicio, v.fin));
}

function incapacidadEn(emp, iso) {
    return (emp.incapacidades || []).find((i) => enRango(iso, i.inicio, finIncapacidad(i)));
}

// Permiso: ausencia autorizada por RH (con o sin goce de sueldo). No es incapacidad del IMSS.
function permisoEn(emp, iso) {
    return (emp.permisos || []).find((p) => enRango(iso, p.inicio, p.fin));
}

// Incidencias registradas a mano en Asistencia (retardo, falta o salida temprana)
function incidenciaEn(emp, iso) {
    return (emp.incidencias || []).find((i) => i.fecha === iso);
}

const TIPOS_INCAPACIDAD = ['Enfermedad general', 'Riesgo de trabajo', 'Maternidad'];

const NOMBRES_INCIDENCIA = {
    vacaciones: 'Vacaciones',
    permiso: 'Permiso',
    incapacidad: 'Incapacidad',
    retardo: 'Retardo',
    falta: 'Falta',
    'salida-temprana': 'Salida temprana'
};

// ---------------------------------------------------------------------
//  Días de descanso obligatorio (Ley Federal del Trabajo, artículo 74)
// ---------------------------------------------------------------------
function enesimoLunes(anio, mes, n) {
    let dia = new Date(anio, mes, 1, 12);
    while (dia.getDay() !== 1) dia = sumarDias(dia, 1);
    return sumarDias(dia, 7 * (n - 1));
}

function descansosObligatorios(anio) {
    const lista = [
        { fecha: new Date(anio, 0, 1, 12), nombre: 'Año Nuevo', regla: '1 de enero' },
        { fecha: enesimoLunes(anio, 1, 1), nombre: 'Día de la Constitución', regla: 'Primer lunes de febrero (conmemora el 5 de febrero)' },
        { fecha: enesimoLunes(anio, 2, 3), nombre: 'Natalicio de Benito Juárez', regla: 'Tercer lunes de marzo (conmemora el 21 de marzo)' },
        { fecha: new Date(anio, 4, 1, 12), nombre: 'Día del Trabajo', regla: '1 de mayo' },
        { fecha: new Date(anio, 8, 16, 12), nombre: 'Día de la Independencia', regla: '16 de septiembre' },
        { fecha: enesimoLunes(anio, 10, 3), nombre: 'Día de la Revolución Mexicana', regla: 'Tercer lunes de noviembre (conmemora el 20 de noviembre)' },
        { fecha: new Date(anio, 11, 25, 12), nombre: 'Navidad', regla: '25 de diciembre' }
    ];
    // 1 de octubre, cada seis años, cuando toma posesión el Presidente de la República (2024, 2030...)
    if (anio >= 2024 && (anio - 2024) % 6 === 0) {
        lista.push({ fecha: new Date(anio, 9, 1, 12), nombre: 'Transmisión del Poder Ejecutivo Federal', regla: '1 de octubre, cada seis años' });
    }
    return lista
        .map((f) => ({ ...f, iso: aISO(f.fecha) }))
        .sort((a, b) => a.iso.localeCompare(b.iso));
}

const FERIADOS_POR_ANIO = {};

function feriadoEn(iso) {
    const anio = Number(iso.slice(0, 4));
    if (!FERIADOS_POR_ANIO[anio]) FERIADOS_POR_ANIO[anio] = new Map(descansosObligatorios(anio).map((f) => [f.iso, f]));
    return FERIADOS_POR_ANIO[anio].get(iso);
}

function textoDias(n) {
    return n === 1 ? '1 día' : `${n} días`;
}

// Días que cuentan como laborables: no cuentan los domingos ni los descansos obligatorios
// (el sábado sí se trabaja)
function diasHabiles(inicioIso, finIso) {
    let dias = 0;
    for (let f = fechaDesdeISO(inicioIso); aISO(f) <= finIso; f = sumarDias(f, 1)) {
        if (f.getDay() !== 0 && !feriadoEn(aISO(f))) dias++;
    }
    return dias;
}

function vacacionesTomadas(emp, anio) {
    return (emp.vacaciones || [])
        .filter((v) => Number(v.inicio.slice(0, 4)) === anio)
        .reduce((total, v) => total + diasHabiles(v.inicio, v.fin), 0);
}

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function fechaLarga(fecha) {
    return `${DIAS_SEMANA[fecha.getDay()]}, ${fecha.getDate()} de ${MESES[fecha.getMonth()].toLowerCase()} de ${fecha.getFullYear()}`;
}

function estadoActual(emp) {
    if (emp.baja) return 'baja';
    if (incapacidadEn(emp, HOY_ISO)) return 'incapacitado';
    if (vacacionEn(emp, HOY_ISO)) return 'vacaciones';
    return 'activo';
}

const ESTADOS = {
    activo: { texto: 'Activo', badge: 'status-active', pill: 'status-pill--success' },
    incapacitado: { texto: 'Incapacitado', badge: 'status-incapacitated', pill: 'status-pill--warning' },
    vacaciones: { texto: 'Vacaciones', badge: 'status-vacation', pill: 'status-pill--purple' },
    baja: { texto: 'Baja', badge: 'status-baja', pill: 'status-pill--danger' }
};

function antiguedadAnios(emp) {
    const ingreso = fechaDesdeISO(emp.ingreso);
    const referencia = emp.baja ? fechaDesdeISO(emp.baja.fecha) : HOY;
    let anios = referencia.getFullYear() - ingreso.getFullYear();
    if (referencia < new Date(referencia.getFullYear(), ingreso.getMonth(), ingreso.getDate(), 12)) anios--;
    return Math.max(0, anios);
}

// Días de vacaciones según la Ley Federal del Trabajo (reforma 2023)
function getVacationDaysForYear(tenureYears) {
    if (tenureYears < 1) return 0;
    if (tenureYears <= 5) return 10 + tenureYears * 2;
    return 22 + Math.floor((tenureYears - 6) / 5) * 2;
}

// =====================================================================
//  ASISTENCIA FICTICIA (determinística para que siempre dé lo mismo)
// =====================================================================
function aleatorio(semilla) {
    let h = 2166136261;
    for (const c of semilla) {
        h ^= c.charCodeAt(0);
        h = Math.imul(h, 16777619);
    }
    // Mezcla final para que semillas parecidas (mismo ID, días seguidos) no den valores parecidos
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
}

function horaTexto(minutos) {
    return `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;
}

// Devuelve el registro de un día o null si no aplica (antes del ingreso, después de la baja o día futuro)
function registroDia(emp, fecha) {
    const iso = aISO(fecha);
    if (iso < emp.ingreso || iso > HOY_ISO || (emp.baja && iso > emp.baja.fecha)) return null;
    if (fecha.getDay() === 0) return { estado: 'descanso', horas: 0 };
    const feriado = feriadoEn(iso);
    if (feriado) return { estado: 'descanso', horas: 0, feriado };
    if (vacacionEn(emp, iso)) return { estado: 'vacaciones', horas: 0 };
    const incapacidad = incapacidadEn(emp, iso);
    if (incapacidad) return { estado: 'incapacidad', horas: 0, incapacidad };
    const permiso = permisoEn(emp, iso);
    if (permiso) return { estado: 'permiso', horas: 0, permiso };
    if (incidenciaEn(emp, iso)?.tipo === 'falta') return { estado: 'falta', horas: 0 };

    const r = aleatorio(emp.id + iso);
    // Tasas ficticias realistas: ~2.5 % de faltas y ~7.5 % de retardos
    if (r < 0.025) return { estado: 'falta', horas: 0 };

    const esSabado = fecha.getDay() === 6;
    const minutosTarde = r < 0.10 ? TOLERANCIA_MINUTOS + 1 + Math.floor(r * 1000) % 30 : Math.floor(r * 1000) % 12;
    const entrada = 8 * 60 + minutosTarde;
    const salida = (esSabado ? 14 * 60 : 17 * 60) + Math.floor(aleatorio(iso + emp.id) * 20);
    const comida = esSabado ? 0 : 60;
    const horas = Math.round(((salida - entrada - comida) / 60) * 100) / 100;

    return {
        estado: minutosTarde > TOLERANCIA_MINUTOS ? 'retardo' : 'asistencia',
        entrada: horaTexto(entrada),
        salida: horaTexto(salida),
        horas
    };
}

function resumenRango(emp, inicio, fin) {
    const resumen = { horas: 0, asistencias: 0, faltas: 0, retardos: 0, permisos: 0, incapacidades: 0 };
    for (let fecha = new Date(inicio); fecha <= fin; fecha = sumarDias(fecha, 1)) {
        const registro = registroDia(emp, fecha);
        if (!registro) continue;
        resumen.horas += registro.horas;
        if (registro.estado === 'asistencia' || registro.estado === 'retardo') resumen.asistencias++;
        if (registro.estado === 'retardo') resumen.retardos++;
        if (registro.estado === 'falta') resumen.faltas++;
        if (registro.estado === 'permiso') resumen.permisos++;
        if (registro.estado === 'incapacidad') resumen.incapacidades++;
    }
    resumen.horas = Math.round(resumen.horas * 10) / 10;
    return resumen;
}

// =====================================================================
//  UTILIDADES COMPARTIDAS DE PANTALLA
// =====================================================================
function nombreSucursal(clave) {
    return `${clave} - ${SUCURSALES[clave] || 'Sin sucursal'}`;
}

// =====================================================================
//  EXCEL (exportar / plantilla)
// =====================================================================
// hojas: [{ nombre, filas: [[encabezados], [valores]...] }]
function descargarExcel(nombreArchivo, hojas) {
    if (window.XLSX) {
        const libro = XLSX.utils.book_new();
        hojas.forEach((hoja) => {
            const ws = XLSX.utils.aoa_to_sheet(hoja.filas);
            ws['!cols'] = hoja.filas[0].map((_, col) => ({
                wch: Math.min(45, Math.max(...hoja.filas.map((f) => String(f[col] ?? '').length)) + 2)
            }));
            XLSX.utils.book_append_sheet(libro, ws, hoja.nombre);
        });
        XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
        return 'xlsx';
    }

    // Sin conexión a internet no carga la librería: se descarga la primera hoja como CSV (Excel también lo abre)
    const csv = hojas[0].filas
        .map((fila) => fila.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `${nombreArchivo}.csv`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
    return 'csv';
}
