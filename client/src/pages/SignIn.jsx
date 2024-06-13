import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/userSlice';
import { toast } from 'react-hot-toast';
import GoogleAuthBtn from '../components/GoogleAuthBtn';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: 'test@gmail.com', password: 'test@password' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);
      if (data.isSuccess === false) {
        setError(data.message);
      }
      else {
        dispatch(signInSuccess(data));
        toast.success('User Signed-In Successfully', { duration: 4000 });
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='email' placeholder='Enter Your Email' className='border p-3 rounded-lg' id='email' value={formData.email} onChange={handleChange} required />
        <input type='password' placeholder='Enter Your Password' className='border p-3 rounded-lg' id='password' value={formData.password} onChange={handleChange} required />

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 transition-all active:scale-95' >
          {loading ? 'Loading...' : 'Sign In'}
        </button>

        <GoogleAuthBtn />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Don&apos;t Have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700 hover:underline'>Sign up</span>
        </Link>
      </div>

      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default SignIn;