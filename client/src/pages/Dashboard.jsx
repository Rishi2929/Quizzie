import React from 'react'
import Navbar from '../components/Navbar'
import styles from '../styles/Dashboard.module.scss'


const Dashboard = () => {
    return (
        <div className={styles['dashboard-parent-cont']}>
            <Navbar />
            <div className={styles['dashboard-cont']}>
                Dahsb
            </div>
        </div>
    )
}

export default Dashboard