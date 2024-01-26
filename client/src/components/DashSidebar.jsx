import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Sidebar } from 'flowbite-react'
import { signoutSuccess } from "../redux/user/userSlice"
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { useDispatch } from "react-redux"
export default function DashSidebar() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])
  
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

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
            <Link to='/dashboard?tab=profile' >
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark' as='button'>
                Profile
            </Sidebar.Item>
            </Link>
            <Link onClick={handleSignOut} >
            <Sidebar.Item  icon={HiArrowSmRight} className='cursor-pointer' as='button'>
                Sign Out
            </Sidebar.Item>
            </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
