export type QuizType = "QA" | "Poll";

export type OptionType = "text" | "imgUrl" | "text-imgUrl";

export interface QuizOption {
  _id: string;
  imgUrl: string;
  optionTitle: string;
}

export interface QuizQuestion {
  _id: string;
  optionType: OptionType;
  correctAnswer?: string;
  questionTitle: string;
  timer: string;
  options: QuizOption[];
}

export interface QuizData {
  _id?: string;
  quizName: string;
  quizType: QuizType;
  questions: QuizQuestion[];
}

export interface QuizResponse {
  success?: boolean;
  message?: string;
  quiz?: QuizData & {
    _id: string;
  };
}
