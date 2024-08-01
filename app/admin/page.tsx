'use client'
import {DataTable} from '@/components/table/DataTable'
import StatCard from '@/components/StatCard'
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { columns } from '@/components/table/columns'
import SearchBar from '@/components/SearchBar'
import { Appointment } from '@/types/appwrite.types'


const Admin = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [counts, setCounts] = useState({
        scheduledCount: 0,
        pendingCount: 0,
        cancelledCount: 0,
      });
    useEffect(() => {
      const fetchAppointments = async () => {
        const result = await getRecentAppointmentList();
        setAppointments(result.documents);
        setFilteredAppointments(result.documents);
        setCounts({
            scheduledCount: result.scheduledCount,
            pendingCount: result.pendingCount,
            cancelledCount: result.cancelledCount,
          });
      };
      fetchAppointments();
    }, []);
  
    const handleSearch = (searchResults: Appointment[]) => {
      setFilteredAppointments(searchResults);
    };
    
  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
        <header  className='admin-header'>
            <Link href="/" className='cursor-pointer'>
            <Image src="/assets/icons/logo-full.svg"
            width={32} height={32} alt="logo" className='h-8 w-fit'/>
            </Link>
            <p className='text-16-bold'>
            Admin Dashboard
            </p>
        </header>
        <main className='admin-main'>
            <section    className='w-full space-y-4'>
                <h1 className='header'>
                    Welcome, Admin
                </h1>
            
            </section>
            <section className='admin-stat'>
                <StatCard type="appointments"
                count={counts.scheduledCount}
                label ="Scheduled appointments"
                icon = "/assets/icons/appointments.svg"
                />
               
                <StatCard type="pending"
                count={counts.pendingCount}
                label ="Pending appointments"
                icon = "/assets/icons/pending.svg"
                />

                <StatCard type="cancelled"
                count={counts.cancelledCount}
                label ="Cancelled appointments"
                icon = "/assets/icons/cancelled.svg"
                />
            </section>
            <SearchBar appointments={appointments} onSearch={handleSearch}/>
            <DataTable columns={columns} data={filteredAppointments}/>
        </main>
    </div>
  )
}

export default Admin