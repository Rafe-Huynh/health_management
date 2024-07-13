"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
} from "@/components/ui/form"

import { Button } from "../ui/button"
import CustomForm, { FormFieldType } from "../CustomForm"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { GenderOptions } from "@/constants"
import { Label } from "@radix-ui/react-label"
const RegisterForm = ({ user }: { user: User }) => {

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

  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
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
      if (user) router.push(`/patients/${user.$id}/register`)
    } catch (error) {
      console.log(error)
    }
    setisLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">
            Welcome {user.name}
          </h1>
          <p className="text-dark-700">
            Please fill this form below
          </p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <p className="sub-header">
              Personal Information
            </p>
          </div>
        </section>
        <CustomForm
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Enter Your Name"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user" />
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomForm
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter Your Email"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email" />
          <CustomForm
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="Phone Number"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomForm
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDay"
            label="Date of Birth"
            placeholder="MM/DD/YYYY"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email" />
          <CustomForm
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (<FormControl >
              <RadioGroup className="flex h-11 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                {GenderOptions.map((item) => (
                  <div key={item} className="radio-group">
                    <RadioGroupItem value={item} id={item} />
                    <Label className="cursor-pointer" htmlFor={item}>
                      {item}
                    </Label>
                  </div>

                ))}

              </RadioGroup>
            </FormControl>)}
          />
        </div>
        {/*  expect children need to put something inside */}
        <SubmitButton isLoading={isLoading}> Submit </SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm