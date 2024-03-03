import { Dropdown, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, Avatar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { TextInput } from 'flowbite-react'
import { Button } from 'flowbite-react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import  { toggleTheme } from "../redux/theme/themeSlice"
import { signoutSuccess } from '../redux/user/userSlice'

export default function Header() {
    const navigate = useNavigate()
    const path = useLocation().pathname
    const location = useLocation()
    const dispatch = useDispatch()
    const { theme } = useSelector((state) => state.theme)
    const { currentUser } = useSelector((state) => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    useEffect(()=> {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if(searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    },[location.search])
    const handleSignOut = async() => {
        try {
          const res = await fetch('/api/user/signout', {
            method:'POST'
          })
          const data = await res.json()
          if(!res.ok) {
            console.log(data.message)
          }else{
            dispatch(signoutSuccess())
          }
        } catch (error) {
          console.log(error);
        }
      }

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }  

  return (
    <Navbar className='border-b-2 '>
        <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Taufiq's Blog</span>
        </Link>
        <form onSubmit={handleSubmit}>
            <TextInput 
                type='text'
                placeholder='Search...'
                rightIcon={AiOutlineSearch}
                className='hidden lg:inline '
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
            <AiOutlineSearch />
        </Button>
        <div className="flex gap-2 md:order-2">
            <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
                {theme === 'light' ? <FaSun /> : <FaMoon />}
            </Button>
            {
                currentUser ? (
                    <Dropdown arrowIcon={false} inline label={
                        <Avatar 
                        alt='user'
                        img={currentUser.profilePhoto}
                        rounded
                        />
                    } >
                    <Dropdown.Header>
                        <span className='block text-sm '>
                            @{currentUser.username}
                        </span>
                        <span className='block text-sm font-medium truncate'>
                            {currentUser.email}
                        </span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>
                            Profile
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignOut}>
                            Sign out
                        </Dropdown.Item>
                    </Link>
                    </Dropdown>
                ) : 
                (
                    <Link to='/sign-in' >
                <Button gradientDuoTone='purpleToBlue'outline>
                    Sign in
                </Button>
            </Link>
                )
            }
            <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
            <Navbar.Link active={path === '/'} as={'div'}>
                <Link to='/'>Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/about'} as={'div'}>
                <Link to='/about'>About</Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/projects'} as={'div'}>
                <Link to='/projects'>Projects</Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  )
}
