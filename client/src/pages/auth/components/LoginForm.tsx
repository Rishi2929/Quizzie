import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import axios, { AxiosError } from "axios";

import toast from "react-hot-toast";

import { Formik, Form, Field, FieldProps } from "formik";

import * as Yup from "yup";

import { ArrowUpRight, Loader2, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { server } from "@/App";

interface LoginFormValues {
  email: string;
  password: string;
}

interface ApiErrorResponse {
  message?: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email("Enter a valid email address").required("Email address is required"),

  password: Yup.string().required("Password is required"),
});

const demoCredentials: LoginFormValues = {
  email: "demo@quizzie.io",
  password: "Demo@123",
};

const LoginForm: React.FC = () => {
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    setLoader(true);

    try {
      /*
       * Login
       *
       * Backend sets the HttpOnly accessToken
       * and refreshToken cookies.
       */
      await axios.post(
        `${server}/users/login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
        },
      );

      /*
       * Verify that the newly created authentication
       * cookie can actually authenticate the user.
       */
      await axios.get(`${server}/users/me`, {
        withCredentials: true,
      });

      toast.success("Welcome back!");

      /*
       * AppLayout will verify authentication again
       * when /dashboard mounts.
       */
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      const errorMessage = axiosError.response?.data?.message || "Check your email or password";

      toast.error(errorMessage);

      console.error("Login failed:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-7 shadow-[0_25px_80px_rgba(70,50,140,0.10)] backdrop-blur-md sm:p-8">
      {/* Card glow */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="relative">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleLogin}>
          {({ errors, touched, setValues }) => (
            <Form className="space-y-5">
              {/* Demo Account */}
              <button
                type="button"
                onClick={() => setValues(demoCredentials)}
                className="group w-full rounded-2xl border border-violet-200/70 bg-violet-50/60 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:shadow-md hover:shadow-violet-100/70"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-600">
                      <Sparkles className="size-4" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-900">Explore Demo Account</p>

                      <p className="mt-0.5 text-[10px] text-slate-500">Fill demo credentials automatically</p>
                    </div>
                  </div>

                  <ArrowUpRight className="size-4 text-violet-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">or continue</span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Email */}
              <div className="space-y-1.5 text-left">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                  Email Address
                </Label>

                <Field name="email">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="alex@quizzie.com"
                      className="h-11 rounded-xl border-slate-200 bg-white/60 text-xs transition-all duration-200 hover:border-slate-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0"
                    />
                  )}
                </Field>

                {touched.email && errors.email && <p className="pt-0.5 text-xs text-rose-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                    Password
                  </Label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-violet-600 transition-colors hover:text-violet-700 hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>

                <Field name="password">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-slate-200 bg-white/60 text-xs transition-all duration-200 hover:border-slate-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0"
                    />
                  )}
                </Field>

                {touched.password && errors.password && <p className="pt-0.5 text-xs text-rose-500">{errors.password}</p>}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loader}
                className="group mt-2 h-11 w-full rounded-xl bg-violet-600 text-xs font-semibold tracking-wide text-white shadow-md shadow-violet-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 active:scale-[0.99] disabled:opacity-70"
              >
                {loader ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Continue to App
                    <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;
