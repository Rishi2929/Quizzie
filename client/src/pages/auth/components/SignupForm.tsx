import React, { useState } from "react";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
const API_URL = import.meta.env.VITE_API_URL;

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
  const [loader, setLoader] = useState(false);
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
      await axios.post(`${API_URL}/users/new`, {
        name,
        email,
        password,
      });

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
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-7 shadow-[0_25px_80px_rgba(70,50,140,0.10)] backdrop-blur-md sm:p-8">
      {/* Card glow */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="relative">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ errors, touched }) => (
            <Form className="space-y-4">
              {/* Name */}
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
                      className="h-11 rounded-xl border-slate-200 bg-white/60 text-xs transition-all duration-200 hover:border-slate-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0"
                    />
                  )}
                </Field>

                {touched.name && errors.name && <p className="pt-0.5 text-xs text-rose-500">{errors.name}</p>}
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
                      className="h-11 rounded-xl border-slate-200 bg-white/60 text-xs transition-all duration-200 hover:border-slate-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0"
                    />
                  )}
                </Field>

                {touched.password && errors.password && <p className="pt-0.5 text-xs text-rose-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
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
                      className="h-11 rounded-xl border-slate-200 bg-white/60 text-xs transition-all duration-200 hover:border-slate-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0"
                    />
                  )}
                </Field>

                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="pt-0.5 text-xs text-rose-500">{errors.confirmPassword}</p>
                )}
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
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Sign Up Free
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

export default SignupForm;
