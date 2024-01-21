import { Button } from 'flowbite-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {signInWithPopup, GoogleAuthProvider, getAuth} from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
export default function OAuth() {
//mean-blog-89069
const auth = getAuth(app)
const dispatch = useDispatch()
const navigate = useNavigate()
  const handleOAuth = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({prompt: 'select_account'})
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider)
      const res  = await fetch('/api/auth/google', {
        method:'POST',
        headers: { 'Content-Type': 'application/json'},
        body:JSON.stringify({
          username:resultsFromGoogle.user.displayName,
          email:resultsFromGoogle.user.email,
          googlePhotoUrl:resultsFromGoogle.user.photoURL,
        }),
      })
      const data = await res.json()
      if(res.ok) {
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleOAuth}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}
