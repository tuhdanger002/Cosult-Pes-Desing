export interface Circuito {
    id?: number;              // [id] [int] IDENTITY(1,1)
    smt?: string;             // [SMT] [varchar](50)
    provincia?: string;       // [Provincia] [varchar](50)
    sector?: string;          // [Sector] [varchar](50)
    cliente?: number;         // [Cliente] [int]
    tct?: string;             // [TCT] [varchar](50)
    tipo?: string;            // [Tipo] [varchar](50)
    nombre?: string;          // [Nombre] [varchar](100)
    zdi?: string;             // [ZDI] [varchar](4000)
    grp?: string;             // [GRP] [varchar](50)
    mes?: string;             // [MES] [varchar](50)
    estado?: string;          // [Estado] [varchar](50)
    coD_BDI?: string;         // [COD_BDI] [varchar](50)
    empresa?: string;         // [Empresa] [varchar](50)
    cant_Horas?: number;      // [Cant_Horas] [int]
    acuerdos?: string;        // [Acuerdos] [varchar](max)
    acuerdos_Pes?: string;    // [Acuerdos_Pes] [varchar](max)
    finalidad?: string;       // [Finalidad] [varchar](50)
    se?: string;              // [SE] [varchar](50)
    potenciaKW?: number;      // [PotenciaKW] [decimal](18, 3)
    municipio?: string;       // [Municipio] [varchar](50)
    apoyo?: string;           // [Apoyo] [varchar](50)
    bajaFrec?: string;        // [BajaFrec] [varchar](50)
    codigo_RPM?: string;      // [Codigo_RPM] [varchar](15)
    codigo_Sector?: number;   // [Codigo_Sector] [int]
    codigo_Provincia?: number;// [Codigo_Provincia] [decimal](18, 2)
    reenganche?: string;      // [Reenganche] [varchar](50)
    tension_Cero?: string;    // [Tension_Cero] [varchar](15)
    hospital?: string;        // [Hospital] [varchar](15)
    create_At?: Date;         // [Create_At] [datetime]
    update_At?: Date;         // [Update_At] [datetime]
}