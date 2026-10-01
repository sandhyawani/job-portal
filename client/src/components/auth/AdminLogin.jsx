import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import authApi from '@/api/authApi'
import { toast } from 'sonner'
import { Loader2, ShieldCheck } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'

const AdminLogin = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
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
      // Hardcode role to admin so it's completely hidden from the UI
      const res = await authApi.login({ ...input, role: 'admin' })
      if (res.data.success) {
        dispatch(setUser(res.data.user))
        navigate('/admin/dashboard')
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.friendlyMessage || error.response?.data?.message || error.message || 'Login failed')
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else if (user.role === 'recruiter') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    }
  }, [user, navigate])

  return (
    <div>
      <Navbar />
      <div className="pt-20 pb-8 flex items-center justify-center min-h-[75vh] px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md border border-slate-200 rounded-3xl shadow-lg p-6 sm:p-8 bg-white relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-600"></div>
          
          <div className="flex flex-col items-center mb-6">
            <div className="bg-primary-50 p-3 rounded-2xl mb-2.5 border border-primary-100">
              <ShieldCheck className="text-primary-600 w-7 h-7" />
            </div>
            <h1 className="font-bold text-2xl text-slate-900 text-center tracking-tight">Admin Portal</h1>
            <p className="text-xs text-slate-500 mt-0.5">Authorized personnel login</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1.5">Admin Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="admin@example.com"
                className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3 focus-visible:ring-primary-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1.5">Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="••••••••"
                className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3 focus-visible:ring-primary-500"
                required
              />
            </div>

            {loading ? (
              <Button className="w-full h-10 rounded-xl bg-primary-600 text-white font-semibold mt-3" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold mt-3 shadow-xs transition">
                Access Admin Panel
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
