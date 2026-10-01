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
      <div className="pt-20 pb-8 flex items-center justify-center min-h-[75vh] px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md border border-slate-200 rounded-3xl shadow-lg p-6 sm:p-8 bg-white"
        >
          <h1 className="font-bold text-2xl sm:text-3xl mb-6 text-center text-slate-900 tracking-tight">Login</h1>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1.5">Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="name@example.com"
                className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1.5">Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="••••••"
                className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3"
                required
              />
            </div>

            {/* Role */}
            <div className="flex flex-col pt-1">
              <Label className="text-xs font-semibold text-slate-700 mb-2">Select Role</Label>
              <RadioGroup className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === 'student'}
                    onChange={changeEventHandler}
                    className="w-4 h-4 cursor-pointer text-primary-600 accent-primary-600"
                  />
                  <span>Student</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === 'recruiter'}
                    onChange={changeEventHandler}
                    className="w-4 h-4 cursor-pointer text-primary-600 accent-primary-600"
                  />
                  <span>Recruiter</span>
                </label>
              </RadioGroup>
            </div>

            {/* Button */}
            {loading ? (
              <Button className="w-full h-10 rounded-xl bg-primary-600 text-white font-semibold mt-2" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-xs transition mt-2"
              >
                Sign In
              </Button>
            )}

            <p className="text-xs text-center text-slate-500 mt-3">
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
