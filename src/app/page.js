"use client"
import React, { Component } from 'react'
import styles from './page.module.css'

export default function page() {
  return (
  <div className="container-fluid p-0">
    <div className={styles.companyProfile}>
      <div className={styles.logoContainer}>
        <h6 className='mb-0'>Appicia</h6>
      </div>
      <div className={styles.companyProfileText}>
        <h5 className="fw-semibold mb-0">Hello, Appicia India</h5>
        <p className='text-muted mb-0'>Appicia Technologies</p>
      </div>

    </div>

  </div>
    
  )
}

