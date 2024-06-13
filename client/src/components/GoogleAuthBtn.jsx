import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { app } from '../firebase';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { signInSuccess } from '../redux/userSlice';

const GoogleAuthBtn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const response = await fetch('/api/auth/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await response.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('Could Not Sign In with Google', error);
    }
  }

  return (
    <button onClick={handleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 transition-all active:scale-95' >
      Continue with Google
    </button>
  )
}

export default GoogleAuthBtn;