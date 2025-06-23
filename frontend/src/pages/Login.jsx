import React, { useState } from "react";
import auth from "../assets/auth.jpg";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // ✅ Make sure you import this
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice.js";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Logging in with:", input); // ✅ See the payload

    if (!input.email || !input.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/user/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        navigate("/");
        dispatch(setUser(response.data.user))
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Login Error:", error.response?.data || error.message);

      const errorMessage =
        error.response?.data?.message || "Login failed. Try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center h-screen md:pt-14 md:h-[760px] ">
      <div className="hidden md:block">
        <img src={auth} alt="" className="h-[700px]" />
      </div>
      <div className="flex justify-center items-center flex-1 px-4 md:px-0">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
              Login into your account
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm font-serif text-center">
              Enter your details below to login your account
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={input.email}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900"
                  required
                />
              </div>

              <div className="relative">
                <Label>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  name="password"
                  value={input.password}
                  onChange={handleChange}
                  className="dark:border-gray-600 dark:bg-gray-900"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-5.5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={22} />}
                </button>
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Don't have an account?{" "}
                <Link to={"/signup"}>
                  <span className="underline cursor-pointer hover:text-gray-800">
                    Sign up
                  </span>
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
