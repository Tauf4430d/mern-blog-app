import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Sidebar } from 'flowbite-react'
import { signoutSuccess } from "../redux/user/userSlice"
import { HiAnnotation, HiArrowRight, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser} from 'react-icons/hi'
import { useDispatch, useSelector } from "react-redux"
export default function DashSidebar() {
  const { currentUser } = useSelector(state => state.user)
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
        <Sidebar.ItemGroup className="flex flex-col gap-1">
            <Link to='/dashboard?tab=profile' >
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor={currentUser.isAdmin ? 'yellow' : 'dark'} as='button'>
                Profile
            </Sidebar.Item>
            </Link>
            {currentUser.isAdmin && (
              <Link to='/dashboard?tab=dash'>
              <Sidebar.Item 
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'>
                  DashBoard
                </Sidebar.Item>
            </Link>
            )}
            {currentUser.isAdmin && (
              <Link to='/dashboard?tab=posts'>
              <Sidebar.Item 
                active={tab === 'posts'}
                icon={HiDocumentText}
                as='div'>
                  Posts
                </Sidebar.Item>
            </Link>
            )}
            {currentUser.isAdmin && (
              <Link to='/dashboard?tab=comments'>
              <Sidebar.Item 
                active={tab === 'comments'}
                icon={HiAnnotation}
                as='div'>
                  Comments
                </Sidebar.Item>
            </Link>
            )}
            {currentUser.isAdmin && (
              <Link to='/dashboard?tab=users'>
              <Sidebar.Item 
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                as='div'>
                  Users
                </Sidebar.Item>
            </Link>
            )}
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
