import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import authApi from '@/api/authApi'
import { toast } from 'sonner'
import { Loader2, ShieldAlert } from 'lucide-react'
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
      const res = await authApi.post('/user/login', { ...input, role: 'admin' })
      if (res.data.success) {
        dispatch(setUser(res.data.user))
        navigate('/admin/dashboard')
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Login failed')
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
      <div className="pt-24 flex items-center justify-center min-h-[80vh] px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md border border-gray-200 rounded-xl shadow-lg p-8 bg-white relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="bg-red-100 p-3 rounded-full mb-3">
              <ShieldAlert className="text-red-600 w-8 h-8" />
            </div>
            <h1 className="font-bold text-2xl text-center">Super Admin Portal</h1>
            <p className="text-sm text-gray-500 mt-1">Authorized personnel only</p>
          </div>

          <div className="space-y-5">
            <div>
              <Label>Admin Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="admin@example.com"
                className="h-11 mt-1"
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="••••••••"
                className="h-11 mt-1"
                required
              />
            </div>

            {loading ? (
              <Button className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold mt-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold mt-4">
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
