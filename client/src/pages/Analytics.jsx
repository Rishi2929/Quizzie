import React from 'react'
import Navbar from '../components/Navbar'
import styles from '../styles/Dashboard.module.scss';


const Analytics = () => {
    return (
        <div className={styles['analytics-parent-cont']}>
            <Navbar />
            <div className={styles['analytics-child-cont']}>
                Analytics

            </div>
        </div>
    )
}

export default Analytics