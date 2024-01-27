import { useParams, useNavigate } from "react-router-dom";
import styles from "./Quiz.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import QuizCompleted from "../quizPollCompleted/QuizCompleted";
import PollCompleted from "../quizPollCompleted/PollCompleted";
import { server } from "../../../App";


const imgurl =
  "data:image/jpeg;base64,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";

const quizObj = {
  _id: "quiz1",
  quizName: "General Knowledge",
  quizType: "QA",
  questions: [
    {
      _id: "question1",
      title: "What is the capital of France?",
      optionType: "text",
      correctAnswer: "option1",
      timer: "23",
      options: [
        {
          _id: "option1",
          imgUrl: "",
          optionTitle: "Paris",
        },
        {
          _id: "option2",
          imgUrl: "",
          optionTitle: "Berlin",
        },
      ],
    },
    {
      _id: "question2",
      title: "Which planet is known as the 'Red Planet'?",
      optionType: "text-imgUrl",
      correctAnswer: "option4",
      options: [
        {
          _id: "option3",
          imgUrl: "",
          optionTitle: "Venus",
        },
        {
          _id: "option4",
          imgUrl: "",
          optionTitle: "Mars",
        },
        {
          _id: "option5",
          imgUrl: "",
          optionTitle: "Jupiter",
        },
      ],
    },
    {
      _id: "question3",
      title: "Which element has the chemical symbol 'H'?",
      optionType: "imgUrl",
      correctAnswer: "option8",
      options: [
        {
          _id: "option6",
          imgUrl: "",
          optionTitle: "Helium",
        },
        {
          _id: "option7",
          imgUrl: "",
          optionTitle: "Hydrogen",
        },
        {
          _id: "option8",
          imgUrl: "",
          optionTitle: "Hassium",
        },
        {
          _id: "option9",
          imgUrl: "",
          optionTitle: "Hafnium",
        },
      ],
    },
    {
      _id: "question4",
      title: "Which color is a mixture of red and blue?",
      optionType: "text",
      correctAnswer: "option12",
      options: [
        {
          _id: "option10",
          imgUrl: "",
          optionTitle: "Green",
        },
        {
          _id: "option11",
          imgUrl: "",
          optionTitle: "Yellow",
        },
        {
          _id: "option12",
          imgUrl: "",
          optionTitle: "Purple",
        },
      ],
    },
    {
      _id: "question5",
      title: "Which ocean is the largest?",
      optionType: "text",
      correctAnswer: "option16",
      options: [
        {
          _id: "option13",
          imgUrl: "",
          optionTitle: "Atlantic Ocean",
        },
        {
          _id: "option14",
          imgUrl: "",
          optionTitle: "Indian Ocean",
        },
        {
          _id: "option15",
          imgUrl: "",
          optionTitle: "Southern Ocean",
        },
        {
          _id: "option16",
          imgUrl: "",
          optionTitle: "Pacific Ocean",
        },
      ],
    },
  ],
};

const Quiz = () => {
  const [quizData, setQuizData] = useState(quizObj); //storing all quiz data fetching from database
  const [questionData, setQuestionData] = useState({}); //storing the question which will be shown on screen
  const [questionCounter, setQuestionCounter] = useState(0);
  const [userResponses, setUserResponses] = useState({
    //dummy data
    quizId: "",
    questions: [
      { qId: "", optionId: "", }, { qId: "", optionId: "", },
    ],
  });
  const [correctAnswers, setCorrectAnswers] = useState([
    { qId: "", correctAnswer: "", }, { qId: "", correctAnswer: "", },
  ]);

  const [isQuizCompleted, setIsQuizCompleted] = useState(false); // to show the quiz or poll completed page

  let { id: quizId } = useParams(); // taking param id from url bar and assigning it new name i.e., quizId

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      let quizTempId = "65b4efbc273b1948402c1644";
      const response = await axios.get(`${server}/quiz/getQuiz/${quizTempId}`,
      );

      setQuizData(quizData);
      quizData?.questions?.length ? (() => {
        setQuestionData(quizData.questions[0]);
        setQuestionCounter(0);
      })() : setQuestionData({});
      setUserResponses({ quizId: quizData?._id, questions: [] });
      setCorrectAnswers([
        ...quizData.questions.map((question) => ({
          qId: question._id,
          correctAnswer: question.correctAnswer,
        })),
      ]);
    } catch (error) {
      console.error(error);
    }
  };
  // console.log("questionCounter: ", questionCounter);

  const handleNextBtnClick = () => {
    const currentQuestionCounter = questionCounter;
    console.log("currentQuestionCounter: ", currentQuestionCounter);
    if (currentQuestionCounter + 1 < quizData?.questions?.length) {
      setQuestionData(quizData.questions[currentQuestionCounter + 1]);
      setQuestionCounter(currentQuestionCounter + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleOptionClick = (optionId) => {
    // setting question id and option id in a object so that we can push that object in questions array of user response
    const questionResponse = {};
    questionResponse.qId = questionData._id;
    questionResponse.optionId = optionId;

    // pushing into questions array. This array have previous question responses and we are pushing new response of next question also.
    let allQuestions = userResponses.questions;

    const isSameResponse = allQuestions.some((question) => question.qId === questionData._id && question.optionId === optionId);

    const isResponseNotExist = !allQuestions.some((question) => question.qId === questionData._id);

    const isDifferentResponse = !allQuestions.some((question) => question.qId === questionData._id && question.optionId === optionId);
    //for checking that questionId exist in response but option that exist is different from current selected option

    if (isSameResponse) {
      //questionId already exist in user responses do nothing
    } else if (isResponseNotExist) {
      // user have not responded to the question yet
      allQuestions.push(questionResponse);
    } else if (isDifferentResponse) {
      allQuestions = allQuestions.map((question) => question.qId === questionData._id ? { ...question, optionId: optionId } : question);
    }
    // setting quiz or poll questions response in userResponses state.
    setUserResponses({ ...userResponses, questions: allQuestions });
  };

  const OptionButtonText = (option, index) => {
    return (
      <button
        key={option._id}
        className={`${styles["option"]} ${styles[`option${index + 1}`]} 
        ${styles["option-text"]}`}
        onClick={() => handleOptionClick(option._id)}
        style={{ borderColor: `${userResponses.questions.some((question) => question.optionId === option._id) ? "#5076FF" : ""}` }}>
        {option?.optionTitle}
      </button>
    );
  };

  const OptionButtonImg = (option, index) => {
    return (
      <button
        key={option._id}
        className={`${styles["option"]} ${styles[`option${index + 1}`]} 
        ${styles["option-img"]}`}
        onClick={() => handleOptionClick(option._id)}
        style={{ borderColor: `${userResponses.questions.some((question) => question.optionId === option._id) ? "#5076FF" : ""}`, }}
      >
        {/* <img src={option?.imgUrl} alt="img url" /> */}
        <img src={imgurl} alt="img url" className={styles["option-img"]} />
      </button>
    );
  };

  const OptionButtonTextImg = (option, index) => {
    return (
      <button
        key={option._id}
        className={`${styles["option"]} ${styles[`option${index + 1}`]} 
        ${styles["option-text-img"]}`}
        onClick={() => handleOptionClick(option._id)}
        style={{ borderColor: `${userResponses.questions.some((question) => question.optionId === option._id) ? "#5076FF" : ""}`, }}
      >
        {option?.optionTitle}
        <img
          src={option?.imgUrl}
          alt="text img url"
          className={styles["option-img"]}
        />
      </button>
    );
  };

  // console.log("questionData: ", questionData);
  console.log("userResponses: ", userResponses);

  return (
    <div className={styles["quiz-container"]}>
      {!isQuizCompleted ? (
        <div className={styles["quiz-body"]}>
          <div className={styles["question-header"]}>
            <span className={styles["question-count"]}>
              {questionCounter + 1}/{quizData?.questions?.length}
            </span>
            <span className={styles["question-time"]}>
              {questionData?.timer && "00:10s"}
            </span>
          </div>
          <div className={styles["question-body"]}>
            <div className={styles["question-title"]}>{questionData.title}</div>

            <div className={styles["options-container"]}>
              {questionData.optionType === "text" ? questionData?.options?.map((option, index) => {
                return OptionButtonText(option, index);
              }) : questionData.optionType === "imgUrl" ? questionData?.options?.map((option, index) => {
                return OptionButtonImg(option, index);
              })
                : questionData?.options?.map((option, index) => {
                  return OptionButtonTextImg(option, index);
                })}
            </div>

            <button className={styles["next-btn"]} onClick={handleNextBtnClick}>
              {questionCounter + 1 < quizData?.questions?.length ? "NEXT" : "SUBMIT"}
            </button>
          </div>
        </div>
      ) : quizData?.quizType === "QA" ? (
        <QuizCompleted
          response={userResponses}
          correctAnswers={correctAnswers}
          quizId = {quizId}
        />
      ) : (
        <PollCompleted response = {userResponses} quizId={quizId} />
      )}
    </div>
  );
};

export default Quiz;