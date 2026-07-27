"use client";
import React from 'react'
import CustomerPage from "@/component/customer/page";
import { useRouter, useParams  } from "next/navigation";

function page() {
    
      const router = useRouter();
       const { id } = useParams();
  return (
    <>
     <CustomerPage  mode="edit" customerId={id} />
    </>
  )
}

export default page