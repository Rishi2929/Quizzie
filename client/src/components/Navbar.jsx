import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Dashboard.module.scss';

const Navbar = () => {
    const [activeBtn, setActiveBtn] = useState('dashboard');

    const handleButtonClick = (btnName) => {
        setActiveBtn(btnName);
    };

    return (
        <div className={styles['nav-parent-cont']}>
            <h1>QUIZZIE</h1>
            <div className={styles['nav-links']}>
                <Link
                    to='/dashboard'
                    className={`${styles['nav-btn']} ${activeBtn === 'dashboard' ? styles['active-btn'] : ''}`}
                    onClick={() => handleButtonClick('dashboard')}
                >
                    Dashboard
                </Link>
                <Link
                    to='/analytics'
                    className={`${styles['nav-btn']} ${activeBtn === 'analytics' ? styles['active-btn'] : ''}`}
                    onClick={() => handleButtonClick('analytics')}
                >
                    Analytics
                </Link>
                <button
                    className={`${styles['nav-btn']} ${activeBtn === 'createQuiz' ? styles['active-btn'] : ''}`}
                    onClick={() => handleButtonClick('createQuiz')}
                >
                    Create Quiz
                </button>
            </div>
        </div>
    );
};

export default Navbar;
