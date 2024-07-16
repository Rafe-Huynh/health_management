import { ID } from "node-appwrite"
import { DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID } from "../appwrite.config"
import { parseStringify } from "../utils"

export const createAppointment = async (appointment: CreateAppointmentParams) =>{
    try {
        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            appointment
          )
          return parseStringify(newPatient)
    } catch (error) {
        console.log(error)
    }
}