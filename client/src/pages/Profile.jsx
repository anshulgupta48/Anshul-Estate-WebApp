import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { signOutSuccess, updateUserSuccess, deleteUserSuccess } from '../redux/userSlice';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

const Profile = () => {
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log('Error While Uploading Profile-Image', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
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
        dispatch(updateUserSuccess(data));
        toast.success('User Updated Successfully', { duration: 4000 });
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/sign-out');
      const data = await response.json();

      if (data.isSuccess === false) {
        setError(data.message);
      }
      else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      setError(error.message);
    }
  }

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.isSuccess === false) {
        setError(data.message);
      }
      else {
        dispatch(deleteUserSuccess());
        toast.success('User Deleted Successfully', { duration: 4000 });
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const response = await fetch(`/api/user/show-all-listings/${currentUser._id}`);
      const data = await response.json();

      if (data.isSuccess === false) {
        setShowListingsError(true);
      }
      else {
        setUserListings(data);
      }
    } catch (error) {
      setShowListingsError(true);
    }
  }

  const handleDeleteListing = async (listingId) => {
    try {
      const response = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.isSuccess === false) {
        console.log(data.message);
      }
      else {
        setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
        toast.success('Listing Deleted Successfully', { duration: 4000 });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : ('')}
        </p>

        <input type='text' placeholder='Enter Your Username' defaultValue={currentUser.username} id='username' className='border p-3 rounded-lg' onChange={handleChange} />
        <input type='email' placeholder='Enter Your Email' id='email' defaultValue={currentUser.email} className='border p-3 rounded-lg' onChange={handleChange} />
        <input type='password' placeholder='Enter Your Password' onChange={handleChange} id='password' className='border p-3 rounded-lg' />

        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 transition-all active:scale-95' >
          {loading ? 'Loading...' : 'Update'}
        </button>

        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'} >
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer hover:underline' >
          Delete account
        </span>

        <span onClick={handleSignOut} className='text-red-700 cursor-pointer hover:underline'>
          Sign out
        </span>
      </div>

      <p className='text-red-700'>{error ? error : ''}</p>
      <p className='text-green-700'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <div className='w-100 flex justify-center items-center'>
        <button onClick={handleShowListings} className='text-green-700 hover:underline'>
          Show Listings
        </button>
      </div>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error Showing Listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>

          {userListings.map((listing) => (
            <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4' >
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt='listing cover' className='h-16 w-16 object-contain' />
              </Link>

              <Link className='text-slate-700 font-semibold  hover:underline truncate flex-1' to={`/listing/${listing._id}`} >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
                <button onClick={() => handleDeleteListing(listing._id)} className='text-red-700 uppercase' >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile;