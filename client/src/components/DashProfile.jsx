import { TextInput, Button, Alert } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'
import { updateFailure, updateStart, updateSuccess } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function DashProfile() {
  const { currentUser } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileURL, setImageFileURL] = useState(null)
  const [imageFileUploading, setImageUploading] = useState(null)
  const [imageFileUploadingError, setImageUploadingError] = useState(null)
  const [imageloadingSuccess, setUploadingSuccess] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateUserError, setUpdateUserError] = useState(null)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const filePickerRef = useRef()
  const dispatch = useDispatch()
  useEffect(() => {
    if (imageFile) {
      uploadImage()
    }
  }, [imageFile])
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]:e.target.value})
  }
  const hanldeSubmit = async(e) => {
    e.preventDefault()
    setUpdateUserError(null)
    if(Object.keys(formData).length === 0) {
      setUpdateUserError("There is nothing to change")
      return
    }
    if(imageloadingSuccess) {
      setUpdateUserError("Please wait for image to Upload")
      return
    }
    try {
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method:"PUT",
        headers:{
          'Content-Type':"application/json",
        },
        body:JSON.stringify(formData)
      })
      const data = await res.json()
      if(!res.ok) {
        dispatch(updateFailure(data.message))
        setUpdateUserError(data.message)
      }else{
        dispatch(updateSuccess(data))
        setUpdateUserSuccess("User's Profile updated Successfully")
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
    }
  }
  const uploadImage = async () => {
    setUploadingSuccess(true)
    setImageUploadingError(null)
    const storage = getStorage(app)
    const fileName = new Date().getTime + imageFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageUploading(progress.toFixed(0))
      },
      (error) => {
        setImageUploadingError("Could not upload image (File must be less than 2MB)")
        setImageUploading(null)
        setImageFileURL(null)
        setImageFile(null)
        setUploadingSuccess(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL)
          setFormData({...formData, profilePhoto : downloadURL})
          setUploadingSuccess(false)
        })
      }
    )
  }

  const handleImagechange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        setImageFileURL(URL.createObjectURL(file));
        setImageUploadingError(null); 
      } else {
        setImageUploadingError('Please select a valid image file.');
      }
    }
  };
  
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={hanldeSubmit}>
        <input type="file" accept="image/*" onChange={handleImagechange} ref={filePickerRef} hidden />
        <div className=" relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
          {imageFileUploading && <CircularProgressbar value={imageFileUploading || 0} text={`${imageFileUploading}%`} strokeWidth={5} styles={{ root: { width: '100%', height: '100%', position: 'absolute',top:0, left:0 },path:{stroke:`rgba(52,152,199,${imageFileUploading/100})`}, }}/>} 
          <img src={imageFileURL || currentUser.profilePhoto} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[ligthgray] ${imageFileUploading && imageFileUploading < 100 && 'opacity-60'}`} />
        </div>
        {imageFileUploadingError && (<Alert color='failure'>{imageFileUploadingError}</Alert>)}
        <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type="email" id="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type="password" id="password" placeholder="*********" onChange={handleChange} />
        <Button type='submit' outline gradientDuoTone='purpleToBlue' >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess &&  (<Alert color='success' className="mt-5">
        {updateUserSuccess}
      </Alert>)}
      {updateUserError &&  (<Alert color='failure' className="mt-5">
        {updateUserError}
      </Alert>)}
    </div>
  )
}
