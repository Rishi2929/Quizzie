import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { Loader2, ArrowUpRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Context } from "@/main";
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

const LoginForm: React.FC = () => {
  const initialValues: LoginFormValues = { email: "", password: "" };
  const { setIsAuthenticated } = useContext(Context);
  const [loader, setLoader] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    setLoader(true);
    try {
      const { email, password } = values;
      const response = await axios.post<{ token: string }>(`${server}/users/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
      toast.success("Welcome back!");
      setIsAuthenticated(true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || "Check your email or password";
      toast.error(errorMessage);
      console.error("Login failed", error);
      setIsAuthenticated(false);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Welcome back</h2>
        <p className="text-xs text-slate-500">Please enter your credentials to continue.</p>
      </div>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleLogin}>
        {({ errors, touched }) => (
          <Form className="space-y-5">
            {/* Email Field */}
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
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-xs transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0 border hover:border-slate-300"
                  />
                )}
              </Field>
              {touched.email && errors.email && <p className="text-xs text-rose-500 pt-0.5">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Password
                </Label>
                <Link to="/forgot-password" className="text-xs font-medium text-violet-600 hover:text-violet-700 hover:underline">
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
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-xs transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0 border hover:border-slate-300"
                  />
                )}
              </Field>
              {touched.password && errors.password && <p className="text-xs text-rose-500 pt-0.5">{errors.password}</p>}
            </div>

            {/* Action Button */}
            <Button
              type="submit"
              disabled={loader}
              className="group relative h-11 w-full rounded-xl bg-violet-600 text-white text-xs font-semibold tracking-wide transition-all duration-200 hover:bg-violet-700 hover:shadow-md hover:shadow-violet-200 active:scale-[0.99] disabled:opacity-70 mt-2"
            >
              {loader ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5">
                  <span>Continue to App</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              )}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
