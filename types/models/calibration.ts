import { Types } from "mongoose"

export interface Calibration {
    id_maquina: string
    nomMaquina: string
    serial: string
    manufacturador: string
    proveedor: string
    type: string
    loc1: string
    loc2: string
    loc3:string
    last_calibration_date:Date
    calibration_interval_define:string
    expira:Date
    rango_trabajo:string
    comments:string
    foto_equipo?: Types.ObjectId
    foto_etiqueta_calibracion?: Types.ObjectId
    liga_certificado:string
    status: boolean
}

