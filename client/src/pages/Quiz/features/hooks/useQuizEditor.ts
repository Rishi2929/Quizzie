import { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";

import { MAX_OPTIONS, MAX_QUESTIONS, MIN_OPTIONS, MIN_QUESTIONS } from "../constants";

import type { OptionType, QuizOption, QuizQuestion, QuizType } from "../types/quiz.types";
import { createEmptyQuestion } from "../utils/quiz.util";

export function useQuizEditor(quizType: QuizType) {
  const firstQuestion = createEmptyQuestion(quizType);

  const [questions, setQuestions] = useState<QuizQuestion[]>([firstQuestion]);

  const [selectedQuestionId, setSelectedQuestionId] = useState(firstQuestion._id);

  const selectedQuestion = questions.find((question) => question._id === selectedQuestionId) ?? questions[0];

  const loadQuestions = (loadedQuestions: QuizQuestion[]) => {
    if (!loadedQuestions.length) {
      const question = createEmptyQuestion(quizType);

      setQuestions([question]);
      setSelectedQuestionId(question._id);

      return;
    }

    setQuestions(loadedQuestions);
    setSelectedQuestionId(loadedQuestions[0]._id);
  };

  const addQuestion = () => {
    if (questions.length >= MAX_QUESTIONS) {
      toast.error(`Maximum ${MAX_QUESTIONS} questions allowed`);
      return;
    }

    const question = createEmptyQuestion(quizType);

    setQuestions((current) => [...current, question]);

    setSelectedQuestionId(question._id);
  };

  const deleteQuestion = (questionId: string) => {
    if (questions.length <= MIN_QUESTIONS) {
      toast.error("A quiz must have at least 1 question");
      return;
    }

    setQuestions((current) => current.filter((question) => question._id !== questionId));

    if (selectedQuestionId === questionId) {
      const remaining = questions.filter((question) => question._id !== questionId);

      setSelectedQuestionId(remaining[0]._id);
    }
  };

  const updateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    setQuestions((current) =>
      current.map((question) =>
        question._id === questionId
          ? {
              ...question,
              ...updates,
            }
          : question,
      ),
    );
  };

  const updateCurrentQuestion = (updates: Partial<QuizQuestion>) => {
    if (!selectedQuestion) return;

    updateQuestion(selectedQuestion._id, updates);
  };

  const changeOptionType = (type: OptionType) => {
    if (!selectedQuestion) return;

    const options: QuizOption[] = [
      {
        _id: uuid(),
        imgUrl: "",
        optionTitle: "",
      },
      {
        _id: uuid(),
        imgUrl: "",
        optionTitle: "",
      },
    ];

    updateCurrentQuestion({
      optionType: type,
      options,
      correctAnswer: "",
      timer: "",
    });
  };

  const updateOption = (optionId: string, updates: Partial<QuizOption>) => {
    if (!selectedQuestion) return;

    const options = selectedQuestion.options.map((option) =>
      option._id === optionId
        ? {
            ...option,
            ...updates,
          }
        : option,
    );

    updateCurrentQuestion({
      options,
    });
  };

  const selectCorrectAnswer = (optionId: string) => {
    if (quizType !== "QA") return;

    updateCurrentQuestion({
      correctAnswer: optionId,
    });
  };

  const addOption = () => {
    if (!selectedQuestion) return;

    if (selectedQuestion.options.length >= MAX_OPTIONS) {
      toast.error(`Maximum ${MAX_OPTIONS} options allowed`);
      return;
    }

    const option: QuizOption = {
      _id: uuid(),
      imgUrl: "",
      optionTitle: "",
    };

    updateCurrentQuestion({
      options: [...selectedQuestion.options, option],
    });
  };

  const deleteOption = (optionId: string) => {
    if (!selectedQuestion) return;

    if (selectedQuestion.options.length <= MIN_OPTIONS) {
      toast.error("Each question requires at least 2 options");
      return;
    }

    const options = selectedQuestion.options.filter((option) => option._id !== optionId);

    updateCurrentQuestion({
      options,
      correctAnswer: selectedQuestion.correctAnswer === optionId ? "" : selectedQuestion.correctAnswer,
    });
  };

  const setTimer = (timer: string) => {
    updateCurrentQuestion({
      timer,
    });
  };

  return {
    questions,
    selectedQuestion,
    selectedQuestionId,

    setSelectedQuestionId,
    loadQuestions,

    addQuestion,
    deleteQuestion,

    updateCurrentQuestion,
    changeOptionType,

    updateOption,
    onSelectCorrect: selectCorrectAnswer,

    addOption,
    deleteOption,

    setTimer,
  };
}
