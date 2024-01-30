import{ BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Header from './components/Header'
import FooterCom from './components/FooterCom'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdmin from './components/OnlyAdmin'
import CreatePost from './pages/CreatePost'
export default function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/sign-up' element={<Signup/>}></Route>
        <Route path='/sign-in' element={<Signin/>}></Route>
        <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        </Route>
        <Route element={<OnlyAdmin />}>
        <Route path='/create-post' element={<CreatePost/>}></Route>
        </Route>
        <Route path='/projects' element={<Projects/>}></Route>
      </Routes>
      <FooterCom />
    </BrowserRouter>
  )
}
