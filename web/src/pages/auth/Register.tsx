import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["farmer", "processor", "lab", "certifier", "brand"]),
  orgName: z.string().optional(),
  location: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: registerUser, loading } = useAuth();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "farmer" }
  });

  const role = watch("role");

  const onSubmit = async (data: RegisterForm) => {
    try {
      const resultAction: any = await registerUser(data);
      if (resultAction.meta.requestStatus === "fulfilled") {
        toast.success("Registration successful!");
      } else {
        toast.error(resultAction.payload || "Registration failed");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
            Join AyurChain
          </h2>
          <p className="mt-2 text-gray-500">Create your account to participate in the supply chain</p>
        </div>

        <Card className="p-2 sm:p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" placeholder="John Doe" {...register("name")} error={errors.name?.message} />
              
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  {...register("role")}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary border px-3 py-2 bg-white sm:text-sm"
                >
                  <option value="farmer">Farmer</option>
                  <option value="processor">Processor</option>
                  <option value="lab">Lab Tester</option>
                  <option value="certifier">Certifier</option>
                  <option value="brand">Brand/Retailer</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
              </div>
            </div>

            <Input label="Email Address" type="email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} />

            {(role !== "farmer") && (
              <Input label="Organization Name" placeholder={(role === "lab" ? "Testing Lab Ltd." : "Company Name")} {...register("orgName")} />
            )}
            
            {role === "farmer" && (
              <Input label="Farm Location" placeholder="Kerala, India" {...register("location")} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Password" type="password" placeholder="••••••••" {...register("password")} error={errors.password?.message} />
              <Input label="Confirm Password" type="password" placeholder="••••••••" {...register("confirmPassword")} error={errors.confirmPassword?.message} />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" loading={loading}>Create Account</Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-light">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
