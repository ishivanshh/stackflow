"use client";


import { useAuthStore } from "@/store/Auth";
import React from "react";

function LoginPage() {
    const {login} = useAuthStore();
    const [isLoading , setIsLoading] = React.useState(false);
    const [error , setError] = React.useState("")

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // collect data
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")
        

        // validation 

        if(!email || !password){
            setError(() => "Please fill all the detials")
            return 
        }

        // handle loading and error
        setIsLoading(() => true)
        setError(() => "")

        // login => store
        
        const loginRespone = (await login(email.toString() , password.toString()))
        if(loginRespone.error){
            setError(() => loginRespone.error!.message)
        }

          setIsLoading(() => false)
    }

    return (
        <div>
            login page
        </div>
    )
}

export default LoginPage;
