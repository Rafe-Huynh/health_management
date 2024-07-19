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
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { SelectItem } from "@radix-ui/react-select"
import { Doctors } from "@/constants"
import { Appointment } from "@/types/appwrite.types"
import { scheduler } from "timers/promises"
const AppointmentForm = ({userId, patientId, type, appointment, setOpen} : {
    userId: string,
    patientId: string,
    type: "create" | "cancel" | "schedule",
    appointment: Appointment,
    setOpen: (open:Boolean) => void
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
        console.log('type', type)
        try {
            if (type === 'create' && patientId){
                const appointmentData = {
                    primaryPhysician: values.primaryPhysician,
                    userId,
                    patient: patientId,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status
                }
                const appointment = await createAppointment(appointmentData)
                if(appointment){
                    console.log("im here too")
                    form.reset()
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
                }
            } else {
              const appointmentToUpdate  = {
                userId,
                appointmentId: appointment?.$id!,
                appointment: {
                  primaryPhysician: values?.primaryPhysician,
                  schedule: new Date(values?.schedule),
                  status: status as Status,
                  cancellationReason: values?.cancellationReason
                },
                type
              }
              const updatedAppointment = await updateAppointment(appointmentToUpdate)
              if(updatedAppointment) {
                setOpen && setOpen(false)
                form.reset()
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
       {type === 'create' && <section className="mb-12 space-y-4">
            <h1 className="header">
                Welcome to Health Management
            </h1>
            <p className="text-dark-700">
                Schedule your doctor appointment
            </p>
        </section>
        }
        {
            type !== "cancel" && (
                <>
                <CustomForm
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
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