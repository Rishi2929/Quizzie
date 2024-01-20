import React, { useState } from 'react';
import styles from '../styles/Dashboard.module.scss';
import img from '../assets/Delete icon.svg'
import img2 from '../assets/Quiz Test Vector.png'


const Poll = ({ onClose, showTimerRow }) => {
    const [circleCount, setCircleCount] = useState(1);
    const [inputCount, setInputCount] = useState(1);
    const [selectedOption, setSelectedOption] = useState('Text');
    const [selectedTimer, setSelectedTimer] = useState('OFF'); // Add state for selected timer



    const handlePlusClick = () => {
        if (circleCount < 5) {
            setCircleCount((prevCount) => prevCount + 1);
        }
    };
    const handleDeleteClick = () => {

        setCircleCount((prevCount) => prevCount - 1);

    };
    const AddInput = () => {
        if (inputCount < 4) {
            setInputCount((prevCount) => prevCount + 1);
        }
    }

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    const handleDeleteOption = (index) => {
        setInputCount((prevCount) => prevCount - 1);
    };

    const handleTimerChange = (value) => {
        setSelectedTimer(value);
    };

    return (
        <div className={styles['popup-parent-cont']}>
            <div className={styles['popup-child-cont']}>
                <div className={styles['poll-cont']}>
                    <div className={styles['poll-row1']}>
                        {[...Array(circleCount)].map((_, index) => (
                            <div>
                                <div key={index} className={styles['circle']}>
                                    <p>{index + 1}</p>
                                </div>
                                {(index > 0) && (
                                    <button onClick={handleDeleteClick} className={styles['del-circle-btn']}>
                                        <img src={img2} alt="" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button onClick={handlePlusClick} className={styles['add-circle-btn']}>+</button>

                        <div className={styles['remind']}>
                            <p>Max 5 questions</p>
                        </div>
                    </div>
                    <div className={styles['poll-row2']}>
                        <input placeholder='Poll Question' />
                    </div>
                    <div className={styles['poll-row3']}>
                        <span>Option Type</span>
                        <label >
                            <input
                                type="radio"
                                value="Text"
                                name="optionType"
                                checked={selectedOption === 'Text'}
                                onChange={() => handleOptionChange('Text')}

                            />
                            Text
                        </label>
                        <label >
                            <input
                                type="radio"
                                value="Image URL"
                                name="optionType"
                                checked={selectedOption === 'Image URL'}
                                onChange={() => handleOptionChange('Image URL')}

                            />
                            Image URL
                        </label>
                        <label >
                            <input
                                type="radio"
                                name="optionType"
                                value=" Text & Image URL"
                                checked={selectedOption === 'Text & Image URL'}
                                onChange={() => handleOptionChange('Text & Image URL')}
                            />
                            Text & Image URL
                        </label>

                    </div>
                    <div className={styles['poll-row4']}>
                        {[...Array(inputCount)].map((_, index) => (
                            <div key={index} className={styles['input-types']}>
                                {selectedOption === 'Text' ? (
                                    <>
                                        <input type="radio" name="options" />
                                        <input type="text" placeholder='Text' className={styles['input-box']} />
                                    </>
                                ) : selectedOption === 'Image URL' ? (
                                    <>
                                        <input type="radio" name="options" />
                                        <input type="text" placeholder='Image URL' className={styles['input-box']} />
                                    </>
                                ) : selectedOption === 'Text & Image URL' ? (

                                    <div className={styles['img-text']}>
                                        <input type="radio" name="options" />
                                        <input type="text" placeholder='Text' className={styles['input-box']} />
                                        <input type="text" placeholder='Image URL' className={styles['input-box']} />
                                    </div>

                                ) : null}
                                {(index === 2 || index === 3) && (
                                    <button
                                        onClick={() => handleDeleteOption(index)}
                                        className={`${styles['delete-btn']} ${selectedOption === 'Text & Image URL' ? styles['delete-btn-img-text'] : ''}`}
                                    >
                                        <img src={img} alt="" />
                                    </button>
                                )}
                            </div>
                        ))}

                        {inputCount < 4 && (
                            <button onClick={AddInput} className={styles['add-btn']}>
                                Add option
                            </button>
                        )}

                    </div>
                    {showTimerRow && <div className={styles['timer-row-4']}>
                        <p>Timer</p>
                        <button
                            onClick={() => handleTimerChange('OFF')}
                            className={selectedTimer === 'OFF' ? styles['selected-timer-btn'] : ''}
                        >
                            OFF
                        </button>
                        <button
                            onClick={() => handleTimerChange('5 sec')}
                            className={selectedTimer === '5 sec' ? styles['selected-timer-btn'] : ''}
                        >
                            5 sec
                        </button>
                        <button
                            onClick={() => handleTimerChange('10 sec')}
                            className={selectedTimer === '10 sec' ? styles['selected-timer-btn'] : ''}
                        >
                            10 sec
                        </button>

                    </div>}
                    <div className={styles['poll-row-5']}>
                        <button onClick={onClose} className={styles['cancel-btn']}>Cancel</button>
                        <button className={styles['del-btn']}>Continue</button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Poll;
