import create from "./create.machine"
import get from "./get.machine"
import list from "./get.machine.list"
import update from "./update.machine"
import delite from "./delete.machime"
import getMachineImage from "./get.machine.image"
import getMachineTag from "./get.machine.tag"
import getAll from "./get.machines.list.complete"

export const createMachineController = create
export const getMachineController = get
export const listMachineController = list
export const updateMachineController = update
export const deleteMachineController = delite
export const getMachineImageController = getMachineImage
export const getMachineTagController = getMachineTag
export const getAllMachineController = getAll