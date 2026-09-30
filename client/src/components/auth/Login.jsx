import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '@/api/authApi'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
    role: '',
  })

  const { loading, user } = useSelector((store) => store.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      dispatch(setLoading(true))
      const res = await authApi.login(input)
      if (res.data.success) {
        dispatch(setUser(res.data.user))
        if (res.data.user?.role === 'recruiter') {
          navigate('/admin/dashboard')
        } else {
          navigate('/dashboard')
        }
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.friendlyMessage || error.response?.data?.message || error.message || 'Something went wrong')
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    if (user) {
      if (user.role === 'recruiter') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    }
  }, [user, navigate])

  return (
    <div>
      <Navbar />
      {/* Add top padding to avoid overlap with fixed navbar */}
      <div className="pt-24 flex items-center justify-center min-h-[80vh] px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-lg border border-gray-200 rounded-xl shadow-lg p-8 bg-white"
        >
          <h1 className="font-bold text-3xl mb-10 text-center">Login</h1>

          <div className="space-y-5">
            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="name@example.com"
                className="h-11"
              />
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="••••••"
                className="h-11"
              />
            </div>

            {/* Role */}
            <div>
              <Label>Select Role</Label>
              <RadioGroup className="flex items-center gap-8 mt-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === 'student'}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                  />
                  <Label>Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === 'recruiter'}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                  />
                  <Label>Recruiter</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Button */}
            {loading ? (
              <Button className="w-full h-11 rounded-xl bg-primary-600 text-white font-semibold" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-11 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-xs transition"
              >
                Sign In
              </Button>
            )}

            <p className="text-xs text-center text-slate-500 mt-4">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
