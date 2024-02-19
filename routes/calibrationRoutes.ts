import { Router, RequestHandler } from 'express';
import config from "@config"
const { createPermissions, readPermissions, updatePermissions, } = config.permissionType;
const { machines } = config.routes;
import { validationFields } from '@middlewares/validation-fields';

import { permission } from '@middlewares/RoleValidation';
import { check } from "express-validator"
import jwtValidation from '@middlewares/webtokenValidation';
import { v4 } from "uuid"
import path from "path"
import multer from 'multer'
import { createMachineController, deleteMachineController, getMachineController, 
        listMachineController, updateMachineController, getMachineImageController, 
        getMachineTagController, getAllMachineController } from '@machinecontrollers'

type PermissionOptions = 'createPermissions' | 'readPermissions' | 'updatePermissions' | 'deletePermissions'
const maxSize = 20 * 1024 * 1024
const storage = multer.diskStorage({
    destination: './assets',
    filename: (req, file, cb) => {
        cb(null, v4() + path.extname(file.originalname).toLocaleLowerCase())
    }
})
const uploadFile = multer({ storage, dest: './assets', limits: { fileSize: maxSize } })
const router = Router();

///////////////// POST ////////////////////////////////////////

router.post('/', [
    jwtValidation,
    permission(createPermissions as PermissionOptions, machines),
    uploadFile.fields([{name: 'foto_equipo'},{name: 'foto_etiqueta_calibracion'}]),
    validationFields
] as RequestHandler[], createMachineController);

////////////////// GET ///////////////////////////////////////
router.get('/', [
    jwtValidation,
    permission(readPermissions as PermissionOptions, machines),
    validationFields
] as RequestHandler[], listMachineController);

router.get('/allmachines', [
    jwtValidation,
    permission(readPermissions as PermissionOptions, machines),
    validationFields
] as RequestHandler[], getAllMachineController);

router.get('/id/:id_maquina', [
    jwtValidation,
    check('id_maquina', 'The id is required'),
    validationFields
] as RequestHandler[], getMachineController);

router.get('/image/:machineId', [
    jwtValidation,
    check('machineId', 'The id is required'),
    validationFields
] as RequestHandler[], getMachineImageController)

router.get('/tag/image/:tagId', [
    jwtValidation,
    check('tagId', 'The id is required'),
    validationFields
] as RequestHandler[], getMachineTagController)

////////////////// UPDATE ///////////////////////////////////////
router.put('/updatebyadmin/:id', [
    jwtValidation,
    permission(updatePermissions as PermissionOptions, machines),
    uploadFile.fields([{name: 'foto_equipo'},{name: 'foto_etiqueta_calibracion'}]),
    validationFields
] as RequestHandler[], updateMachineController);


////////////////// DELETE ///////////////////////////////////////
router.delete('/deletebyadmin/:id', [
    jwtValidation,
    permission(readPermissions as PermissionOptions, machines),
    validationFields
] as RequestHandler[], deleteMachineController);


export default router;