"use server";
import { ID, Query } from "node-appwrite"
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, ENDPOINT, messaging, PATIENT_COLLECTION_ID } from "../appwrite.config"
import { parseStringify } from "../utils"
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { formatDateTime } from "../utils";
import { redirect } from 'next/navigation'
export const createAppointment = async (appointment: CreateAppointmentParams) =>{
    try {
        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
          )
          return parseStringify(newPatient)
    } catch (error) {
        console.log(error)
    }
}
export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,

        )
        console.log(appointment)
        return parseStringify(appointment)
    } catch (error) {
     console.log(error)   
    }
}
export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
           
          );
        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0
        }
        const counts = (appointments.documents as Appointment[]).reduce((acc,appointment) => 
        {
            if (appointment.status === "scheduled"){
                acc.scheduledCount += 1
            } else if (appointment.status === "pending"){
                acc.pendingCount += 1
            } else if (appointment.status === 'cancelled'){
                acc.cancelledCount += 1
            }
            return acc
        }, initialCounts)
        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }
        return parseStringify(data)
    } catch (error) {
        console.log(error)
    }
}
export const updateAppointment = async ({appointmentId, userId, appointment, type}: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )
        if(!updatedAppointment){
            throw new Error('Appointment not Found')

        }
        
        const smsMessage = `=${type === 'schedule' ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with DR.${appointment.primaryPhysician}`: 'Your appointment has been cancelled'}`
        await sendSMSNotification(userId, smsMessage)
        revalidatePath('/admin')
        return parseStringify(updatedAppointment)
    } catch (error) {
        console.log(error)
    }
}
export const sendSMSNotification = async (userId: string, content: string)  => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        )
        return parseStringify(message)
    } catch (error) {
        console.log(error)
    }
}

export const deleteAppointment = async (documentId:string) => {
    try {
        await databases.deleteDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, documentId)
        revalidatePath('/admin')
        redirect('/admin')
    } catch (error) {
        console.log(`Error while deleting an Appointment ${error}`)
    }
}
