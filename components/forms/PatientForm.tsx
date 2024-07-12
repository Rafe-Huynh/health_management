"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
  } from "@/components/ui/form"

import { Button } from "../ui/button"
import CustomForm, { FormFieldType } from "../CustomForm"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import  {createUser}  from "@/lib/actions/patient.actions"
const PatientForm = () => {
    const router = useRouter()
    const [isLoading, setisLoading] = useState(false)
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
          name: "",
          email: "",
          phone: ""
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit({name,email,phone}: z.infer<typeof UserFormValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setisLoading(true)

        try {
            const userData = {
                name,
                email,
                phone
            }
            const user = await createUser(userData)
            if(user) router.push(`/patients/${user.$id}/register`)
        } catch (error) {
            console.log(error)
        }
       setisLoading(false)
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
        <CustomForm 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="Enter Your Name"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"/>
        
        <CustomForm 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="Enter Your Email"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"/>
        <CustomForm 
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone Number"
          placeholder="Phone Number"
          />
        {/*  expect children need to put something inside */}
        <SubmitButton isLoading = {isLoading}> Submit </SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm