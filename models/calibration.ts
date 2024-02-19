import { Schema, model } from 'mongoose';
import config from '@config'
import { Calibration } from '@interfaces/models/calibration';
const { permissionList } = config

const CalibrationSchema = new Schema({
    id_maquina: {
        type: String,
        required: [true, 'El Id es obligatorio'],
        unique: true
    },
    nomMaquina: {
        type: String,
        required: [true, 'El nombre de la maquina es obligatorio']
    },
    serial: {
        type: String,
        required: [true, 'El serial es obligatorio'],
        unique: true
    },
    manufacturador: {
        type: String,
        required: [true, 'El manufacturador es obligatorio']
    },
    proveedor: {
        type: String,
        required: [true, 'El proveedor es obligatorio']
    },
    type: {
        type: String,
        required: [true, 'El tipo es obligatorio']
    },
    loc1: {
        type: String,
        required: [true, 'Loc1 es obligatorio']
    },
    loc2: {
        type: String,
        required: [true, 'Loc2 es obligatorio']
    },
    loc3: {
        type: String,
        required: [true, 'Loc3 es obligatorio']
    },
    last_calibration_date: {
        type: Date,
        required: [true, 'La última fecha de calibración es obligatoria'],
    },
    calibration_interval_define: {
        type: String,
        required: [true, 'Intervalo de calibración es obligatoria'],
    },
    expira: {
        type: Date,
        required: [true, 'La fecha de expiración es obligatoria'],
    },
    rango_trabajo: {
        type: String,
        required: [true, 'Rango de trabajo es obligatoria'],
    },
    comments: {
        type: String,
    },
    foto_equipo: {
        type: Schema.Types.ObjectId,
        ref: 'Attachment'
    },
    foto_etiqueta_calibracion: {
        type: Schema.Types.ObjectId,
        ref: 'Attachment'
    },
    liga_certificado: {
        type: String,
        required: [true, 'La liga del certificado es obligatoria'],
    },
    status: {
        type: Boolean,
        default: true,
        require: true
    }
});

CalibrationSchema.methods.toJSON = function () {
    const { __v, ...calibration } = this.toObject()
    return calibration
}

const calibrationModel = model<Calibration>('Calibration', CalibrationSchema);
export default calibrationModel