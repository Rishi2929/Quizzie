import React, { useState } from 'react';
import styles from '../styles/Dashboard.module.scss';
import Analytics from '../pages/Analytics';

const Popup = ({ onClose, isPopupVisible }) => {
    const [selectedType, setSelectedType] = useState('');

    const handleTypeButtonClick = (type) => {
        setSelectedType(type);
    };

    const handleSubmit = () => {
        console.log(selectedType);
        // Return the component outside the render function
        if (selectedType === 'Q&A') {
            return <Analytics />;
        } else if (selectedType === 'Poll') {
            return <h1>sjdkdlsj</h1>;
        }

        return null;
    };

    return (
        isPopupVisible ? (
            <div className={styles['popup-parent-cont']}>
                <div className={styles['popup-child-cont']}>
                    <div className={styles['popup-cont']}>
                        <div>
                            <input type="text" placeholder="Quiz Name" className={styles['input-box']} />
                        </div>
                        <div className={styles['popup-details-row-2']}>
                            <label>Quiz Type</label>
                            <button
                                className={selectedType === 'Q&A' ? styles['selected-button'] : ''}
                                onClick={() => handleTypeButtonClick('Q&A')}
                            >
                                Q & A
                            </button>
                            <button
                                className={selectedType === 'Poll' ? styles['selected-button'] : ''}
                                onClick={() => handleTypeButtonClick('Poll')}
                            >
                                Poll Type
                            </button>
                        </div>
                        <div className={styles['popup-details-row-3']}>
                            <button onClick={onClose}>Cancel</button>
                            <button className={styles['cont-btn']} onClick={handleSubmit}>Continue</button>
                        </div>
                    </div>
                </div>
                {/* Render the component based on handleSubmit result */}
                {handleSubmit()}
            </div>
        ) : null
    );
};

export default Popup;
