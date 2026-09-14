import React, { useState } from "react";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";

import { Loader2, ArrowUpRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { server } from "@/App";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface ApiErrorResponse {
  message?: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

const SignupForm: React.FC = () => {
  const [loader, setLoader] = useState<boolean>(false);

  const initialValues: RegisterFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: RegisterFormValues): Promise<void> => {
    try {
      setLoader(true);
      const { name, email, password } = values;
      await axios.post(`${server}/users/new`, { name, email, password });
      toast.success("User registered successfully!");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Create an account</h2>
        <p className="text-xs text-slate-500">Get started with your free Quizzie workspace.</p>
      </div>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5 text-left">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                Full Name
              </Label>
              <Field name="name">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="Alex Morgan"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-xs transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0 border hover:border-slate-300"
                  />
                )}
              </Field>
              {touched.name && errors.name && <p className="text-xs text-rose-500 pt-0.5">{errors.name}</p>}
            </div>

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
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                Password
              </Label>
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

            {/* Confirm Password Field */}
            <div className="space-y-1.5 text-left">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700">
                Confirm Password
              </Label>
              <Field name="confirmPassword">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-xs transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0 border hover:border-slate-300"
                  />
                )}
              </Field>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-xs text-rose-500 pt-0.5">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loader}
              className="group relative h-11 w-full rounded-xl bg-violet-600 text-white text-xs font-semibold tracking-wide transition-all duration-200 hover:bg-violet-700 hover:shadow-md hover:shadow-violet-200 active:scale-[0.99] disabled:opacity-70 mt-2"
            >
              {loader ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5">
                  <span>Sign Up Free</span>
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

export default SignupForm;
