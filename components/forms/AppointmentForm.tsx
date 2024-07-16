"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
  } from "@/components/ui/form"

import { Button } from "../ui/button"
import Image from "next/image"
import CustomForm, { FormFieldType } from "../CustomForm"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import {getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import  {createUser}  from "@/lib/actions/patient.actions"
import { Doctors } from "@/constants"
import { SelectItem } from "@radix-ui/react-select"
import { stat } from "fs"
import { createAppointment } from "@/lib/actions/appointment.actions"
const AppointmentForm = ({userId, patientId, type} : {
    userId: string,
    patientId: string,
    type: "create" | "cancel" | "schedule"
}) => {
    const AppointmentFormValidation = getAppointmentSchema(type)
    const router = useRouter()
    const [isLoading, setisLoading] = useState(false)
    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
          primaryPhysician: "",
          schedule: new Date(),
          reason: "",
          note: "",
          cancellationReason: "",
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setisLoading(true)
        let status;
        switch(type) {
            case 'schedule':
                status = 'scheduled'
                break
            case 'cancel':
                status = 'cancel'
                break
            default:
                status = 'pending'
                break
        }
        try {
            if (type === 'create' && patientId){
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status
                }
                const appointment = await createAppointment(appointmentData)
                if(appointment){
                    form.reset()
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.id}`)
                }
            }
           
        } catch (error) {
            console.log(error)
        }
       setisLoading(false)
      }
      let buttonLabel;
      switch (type){
        case 'cancel':
            buttonLabel = 'Cancel Appointment'
            break
        case 'create':
            buttonLabel = 'Create Appointment'
            break
        case 'schedule':
            buttonLabel = 'Schedule Appointment'
            break
      }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="mb-12 space-y-4">
            <h1 className="header">
                Welcome to Health Management
            </h1>
            <p className="text-dark-700">
                Schedule your doctor appointment
            </p>
        </section>
        {
            type !== "cancel" && (
                <>
                <CustomForm
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Doctors"
          placeholder="Select your doctor">
          {Doctors.map((item) => (
            <SelectItem key={item.name} value={item.name}>
              <div className="flex cursor-pointer gap-2">
                <Image
                  src={item.image} width={32} height={32} alt="doctor" className="rounded-full border border-dark-500" />
                <p>{item.name}</p>
              </div>
            </SelectItem>
          ))}

        </CustomForm>
        <CustomForm 
        fieldType={FormFieldType.DATE_PICKER}
        control = {form.control}
        name="schedule"
        label="Schedule"
        showTimeSelect
        dateFormat="MM/dd/yyyy - h:mm aa"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="reason"
            label="Reason for appointment"
            placeholder="Enter appointment reason" />
          <CustomForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="note"
            label="Notes"
            placeholder="Notes..."
          />
        </div>
                </>
            )
        }
        {type === "cancel" && (
            <CustomForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="..."
          />
        )}
        {/*  expect children need to put something inside */}
        <SubmitButton isLoading = {isLoading} classname={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>
            
             {buttonLabel}</SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm