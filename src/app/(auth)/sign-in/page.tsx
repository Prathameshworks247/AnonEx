'use client'
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import {useDebounceValue} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)
  const debouncedUsername = useDebounceValue(username,300)
  const router = useRouter()

  //Zod use 
  const form  = useForm<z.infer<typeof signUpSchema>>({
    resolver : zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email: '',
      password: ''
        }
  })

  useEffect(()=> {
    const checkUsernameUnique = async()=> {
      if (debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Erroe checking username")

        }
        finally{
          setIsCheckingUsername(false)
        }
      }
    }
  },[debouncedUsername])

  const onSubmit = async(data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)

  }

  return (
    <div>page</div>
  )
}
export default page