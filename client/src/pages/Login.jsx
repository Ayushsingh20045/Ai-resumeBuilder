import { Mail, User2Icon,Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../configs/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";


const Login = () => {

   const dispatch =  useDispatch()

const query = new URLSearchParams(window.location.search)
// console.log(query)
const urlState=query.get('state')

  const [state, setState] = React.useState(urlState||"login");

  const [message, setmessage] = useState("")
  const [loading, setloading] = useState(false)
  

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setmessage("⚠️ Server is restarting... It may take 30–60 seconds.");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  setloading(true);
    try {
      const{data} = await api.post(`/api/users/${state}`,formData)
      dispatch(login(data))
      localStorage.setItem('token',data.token)
      toast.success(data.message)
      setmessage("")
      setloading(false)
    
    } catch (error) {
          setloading(false)
          setmessage("⚠️ Server is waking up... please wait a few seconds.")
     toast(error?.response?.data?.message || error.message)
    }
    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 




  return (
    <div className="flex justify-center items-center min-h-screen bg-grey-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">Please {state} to continue</p>

           {/* 🟡 SERVER MESSAGE */}
        {message && (
          <div className="mt-4 text-yellow-600 text-sm bg-yellow-100 p-2 rounded-lg">
            {message}
          </div>
        )}
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            
            <User2Icon size={16} color="#687280" />

            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-none outline-none ring-0"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <Mail size={13} color="#687280"/>
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
         <Lock size={13} color="#687280"/>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mt-4 text-left text-green-500">
          <button className="text-sm" type="reset">
            Forget password?
          </button>
        </div>
        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>
        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-500 text-sm mt-3 mb-11"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <a href="#" className="text-green-500 hover:underline">
            click here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;


