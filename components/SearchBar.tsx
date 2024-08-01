'use client'
import { Appointment } from '@/types/appwrite.types'
import React, { useState } from 'react'
interface SearchBarProps {
    appointments: Appointment[];
    onSearch: (result: Appointment[]) => void;
  }

const SearchBar = ({appointments, onSearch}: SearchBarProps) => {
    const [searchText, setSearchText] = useState("")
    const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

    const search = (text: string): Appointment[] => {
        const regex = new RegExp(text, "i")// i flag for case insensitive search
        const filter = appointments.filter((item: Appointment) => 
          regex.test(item.patient.name) || regex.test(item.status) || regex.test(item.primaryPhysician)
        )
        return filter
      }
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
          }
        clearTimeout(searchTimeout as NodeJS.Timeout)
        setSearchText(e.target.value)
        setSearchTimeout(
      setTimeout(() => {
        const searchResults = search(e.target.value);
        onSearch(searchResults);
      }, 500)
    );
  };
  return (
    <div className='flex justify-center w-full rounded-md border border-dark-500 bg-dark-400'>  
        <input type='text'
            placeholder='Search for patient, status or doctor'
            required
            className='w-full pt-2.5 pb-2.5 pl-5 pr-12 text-sm shadow-md font-medium'
            value={searchText}
            onChange={handleSearchChange}
        />
    </div>
    
  )
}

export default SearchBar