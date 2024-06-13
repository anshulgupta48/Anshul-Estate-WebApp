import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PrivateAuthRouter } from './components/PrivateAuthRouter';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import SearchListing from './pages/SearchListing';
import ListingDetails from './pages/ListingDetails';
import Profile from './pages/Profile';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';

const App = () => {
  return (
    <Router>
      <Toaster />
      <Header />

      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/about' element={<About />} />
        <Route exact path='/sign-up' element={<SignUp />} />
        <Route exact path='/sign-in' element={<SignIn />} />
        <Route exact path='/search' element={<SearchListing />} />
        <Route exact path='/listing/:id' element={<ListingDetails />} />

        <Route element={<PrivateAuthRouter />}>
          <Route exact path='/profile' element={<Profile />} />
          <Route exact path='/create-listing' element={<CreateListing />} />
          <Route exact path='/update-listing/:id' element={<UpdateListing />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;