import React, { useState } from 'react';
import styles from '../styles/Dashboard.module.scss';

const Poll = ({ onClose }) => {
    const [circleCount, setCircleCount] = useState(1);
    const [inputCount, setInputCount] = useState(1);
    const [selectedOption, setSelectedOption] = useState('');


    const handlePlusClick = () => {
        if (circleCount < 5) {
            setCircleCount((prevCount) => prevCount + 1);
        }
    };
    const AddInput = () => {
        if (inputCount < 4) {
            setInputCount((prevCount) => prevCount + 1);
        }
    }

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    return (
        <div className={styles['popup-parent-cont']}>
            <div className={styles['popup-child-cont']}>
                <div className={styles['poll-cont']}>
                    <div className={styles['poll-row1']}>
                        {[...Array(circleCount)].map((_, index) => (
                            <div key={index} className={styles['circle']}>
                                <p>{index + 1}</p>
                            </div>
                        ))}
                        <button onClick={handlePlusClick}>+</button>
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
                            <div key={index} className={styles['']}>
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
                                    <>
                                        <div className={styles['img-text']}>
                                            <input type="radio" name="options" />
                                            <input type="text" placeholder='Text' className={styles['input-box']} />
                                            <input type="text" placeholder='Image URL' className={styles['input-box']} />
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        ))}

                        <button onClick={AddInput} className={styles['add-btn']}>
                            Add option
                        </button>
                    </div>
                    <div>
                        <button onClick={onClose} className={styles.button}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Poll;
