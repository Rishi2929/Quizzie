import React, { useState } from 'react';
import styles from '../styles/Login.module.scss';
import Logincomp from '../components/LoginComp';
import RegisterComp from '../components/RegisterComp';

const Login = () => {
    const [activeComponent, setActiveComponent] = useState('register');
    const [btnClicked, setBtnClicked] = useState('register');

    const handleButtonClick = (component) => {
        setActiveComponent(component);
        setBtnClicked(component);
    };

    return (
        <div className={styles['parent-cont']}>
            <div className={styles['child-cont']}>
                <div className={styles['header']}>
                    <h1>QUIZZIE</h1>
                </div>
                <div className={styles['flex-btn']}>
                    <button
                        onClick={() => handleButtonClick('register')}
                        className={`${styles['btn']} ${btnClicked === 'register' ? styles['btn-clicked'] : ''}`}
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => handleButtonClick('login')}
                        className={`${styles['btn']} ${btnClicked === 'login' ? styles['btn-clicked'] : ''}`}
                    >
                        Login
                    </button>
                </div>
                <div className="renderComps">
                    {activeComponent === 'login' && <Logincomp />}
                    {activeComponent === 'register' && <RegisterComp />}
                </div>
            </div>
        </div>
    );
};

export default Login;
