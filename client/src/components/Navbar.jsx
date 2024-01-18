import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Dashboard.module.scss';
import Popup from './Popup';


const Navbar = () => {
    const [activeBtn, setActiveBtn] = useState('dashboard');
    const [isPopupVisible, setPopupVisible] = useState(false);

    const handleButtonClick = (btnName) => {
        setActiveBtn(btnName);
        if (btnName === 'createQuiz') {
            setPopupVisible(true);
        }
    };

    const closePopup = () => {
        setPopupVisible(false);
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
            <div className={styles['cont']}>
                {isPopupVisible && <Popup onClose={closePopup} isPopupVisible={isPopupVisible} />}
            </div>

            {/* Render the Popup component when isPopupVisible is true */}
        </div>
    );
};

export default Navbar;
