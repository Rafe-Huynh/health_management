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
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "@radix-ui/react-label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"


const RegisterForm = ({ user }: { user: User }) => {

  const router = useRouter()
  const [isLoading, setisLoading] = useState(false)
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email:  user.email,
      phone: user.phone
    },
  })

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setisLoading(true)
    let formData;
    if(values.identificationDocument && values.identificationDocument.length > 0){
      const blobFile = new Blob([values.identificationDocument[0]], {type: values.identificationType})
      formData = new FormData()
      formData.append('blobFile', blobFile)
      formData.append('fileName', values.identificationDocument[0].name)  
    }
    try {
      const patientData = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,

      }
      // @ts-ignore
      const patient = await registerPatient(patientData)

      if(patient) router.push(`/patients/${user.$id}/new-appointment`)
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
        <CustomForm
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="address"
          label="Address"
          placeholder="Enter Your Address"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user" />
        <CustomForm
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="occupation"
          label="Occupation"
          placeholder="Enter Your Occupation"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomForm
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact"
            placeholder="Guardian name"
            iconSrc="/assets/icons/user.svg"
            iconAlt="email" />
          <CustomForm
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Number"
            placeholder="Phone Number"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <p className="sub-header">
              Medical Information
            </p>
          </div>
        </section>
        <CustomForm
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Doctor"
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
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomForm
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="Insurance Provider" />
          <CustomForm
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Number"
            placeholder="Enter Your Insurance Number"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Do you have allergies?" />
          <CustomForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current Medication (if any)"
            placeholder="Are you using any medication?"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="if any" />
          <CustomForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="if any"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">
              Identification and Verification
            </h2>
          </div>
        </section>
        <CustomForm
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select Identification Type">
          {IdentificationTypes.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </CustomForm>
        <CustomForm
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="123456789" />
        <CustomForm
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Upload Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange}/>
              </FormControl>
            )}
          />
          <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">
              Consent and Privacy
            </h2>
          </div>
        </section>
        <CustomForm fieldType={FormFieldType.CHECKBOX} 
        control={form.control}
        name="treatmentConsent"
        label="I consent to treatment"
        />
        <CustomForm fieldType={FormFieldType.CHECKBOX} 
        control={form.control}
        name="disclosureConsent"
        label="I consent to disclosure of information"
        />
        <CustomForm fieldType={FormFieldType.CHECKBOX} 
        control={form.control}
        name="privacyConsent"
        label="I consent to privacy policy"
        />
          
        {/*  expect children need to put something inside */}
        <SubmitButton isLoading={isLoading}> Submit </SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm