import React, { useContext, useEffect, useState } from "react";

import axios, { AxiosError } from "axios";

// import CustomLoader from "../components/CurstomLoader";
import moment from "moment";
// import numeral from "numeral";
import { HelpCircle, Eye, Sparkles, TrendingUp, FolderPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Context } from "@/main";
import { server } from "@/App";

interface Question {
  _id?: string;
  [key: string]: unknown;
}

interface Quiz {
  _id: string;
  quizName: string;
  quizCount: number;
  questions: Question[];
  createdAt: string;
}

interface MyQuizApiResponse {
  quiz: Quiz[];
}

const DashboardPage: React.FC = () => {
  const { setLoading, loading } = useContext(Context);
  const [tableData, setTableData] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get<MyQuizApiResponse>(`${server}/quiz/myQuiz`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setTableData(response.data.quiz || []);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error fetching quiz data:", axiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setLoading]);

  // Calculated Analytics
  const totalQuizzes = tableData.length;
  const sumOfQuestions = tableData.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0);
  const sumOfQuizCounts = tableData.reduce((sum, quiz) => sum + (quiz.quizCount || 0), 0);

  // Sorted by impressions (descending)
  const sortedTableData = [...tableData].sort((a, b) => b.quizCount - a.quizCount);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 font-sans selection:bg-violet-100 selection:text-violet-900">
      <Navbar />

      {loading ? (
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">{/* <CustomLoader /> */}</div>
      ) : (
        <main className="mx-auto max-w-7xl px-6 py-8 space-y-10">
          {/* Top Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1: Quizzes Created */}
            <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:border-slate-200">
              <CardContent className="p-0 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quizzes Created</p>
                  <p className="text-4xl font-black tracking-tight text-slate-900">{totalQuizzes}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <Sparkles className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* Stat 2: Total Questions */}
            <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:border-slate-200">
              <CardContent className="p-0 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Questions Created</p>
                  <p className="text-4xl font-black tracking-tight text-slate-900">{sumOfQuestions}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <HelpCircle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* Stat 3: Total Impressions */}
            <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:border-slate-200">
              <CardContent className="p-0 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Impressions</p>
                  <p className="text-4xl font-black tracking-tight text-slate-900">
                    {/* {numeral(sumOfQuizCounts).format("0.0a").toUpperCase()} */}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trending Quizzes Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Trending Quizzes</h2>
                <p className="text-xs text-slate-500">Quizzes ranked by highest total student engagement.</p>
              </div>
            </div>

            {sortedTableData.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/50 p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 mb-3">
                  <FolderPlus className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">No quizzes found</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  You haven&apos;t created any quizzes yet. Click on <span className="font-semibold text-violet-600">Create Quiz</span> in
                  the navigation bar to get started.
                </p>
              </div>
            ) : (
              /* Quiz Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedTableData.map((quiz) => (
                  <Card
                    key={quiz._id}
                    className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]"
                  >
                    <div className="flex flex-col justify-between h-full space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-violet-600 transition-colors">
                          {quiz.quizName}
                        </h3>

                        {/* Impressions Pill */}
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-100 px-3 py-1 text-xs font-bold text-slate-700 shrink-0">
                          <span>{quiz.quizCount}</span>
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[11px] font-medium text-slate-400">
                        <span>Created</span>
                        <span className="text-violet-600 font-semibold">{moment(quiz.createdAt).format("DD MMM, YYYY")}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
};

export default DashboardPage;
