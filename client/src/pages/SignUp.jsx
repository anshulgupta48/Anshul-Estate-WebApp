import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import GoogleAuthBtn from '../components/GoogleAuthBtn';

const SignUp = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/auth/sign-up', {
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
        toast.success('User Created Successfully', { duration: 4000 });
        navigate('/sign-in');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='Enter Your Username' className='border p-3 rounded-lg' id='username' value={formData.username} onChange={handleChange} required />
        <input type='email' placeholder='Enter Your Email' className='border p-3 rounded-lg' id='email' value={formData.email} onChange={handleChange} required />
        <input type='password' placeholder='Enter Your Password' className='border p-3 rounded-lg' id='password' value={formData.password} onChange={handleChange} required />

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 transition-all active:scale-95' >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>

        <GoogleAuthBtn />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700 hover:underline'>Sign in</span>
        </Link>
      </div>

      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default SignUp;