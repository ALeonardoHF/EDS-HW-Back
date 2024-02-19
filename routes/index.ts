import auth from "./authRoutes"
import role from "./roleRoutes"
import user from "./userRoutes"
import attachment from './attachmentRoutes'
import transportType from "./transportTypeRoutes"
import calibration from "./calibrationRoutes"

export const authRoutes = auth
export const userRoutes = user;
export const roleRoutes = role;
export const attachmentRoutes = attachment
export const transportTypeRoutes = transportType
export const calibrationRoutes = calibration