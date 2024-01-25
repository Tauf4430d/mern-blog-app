import { TextInput, Button, Alert } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function DashProfile() {
  const { currentUser } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileURL, setImageFileURL] = useState(null)
  const [imageFileUploading, setImageUploading] = useState(null)
  const [imageFileUploadingError, setImageUploadingError] = useState(null)
  const filePickerRef = useRef()
  useEffect(() => {
    if (imageFile) {
      uploadImage()
    }
  }, [imageFile])

  const uploadImage = async () => {
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL)
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
      <form className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleImagechange} ref={filePickerRef} hidden />
        <div className=" relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
          {imageFileUploading && <CircularProgressbar value={imageFileUploading || 0} text={`${imageFileUploading}%`} strokeWidth={5} styles={{ root: { width: '100%', height: '100%', position: 'absolute',top:0, left:0 },path:{stroke:`rgba(52,152,199,${imageFileUploading/100})`}, }}/>} 
          <img src={imageFileURL || currentUser.profilePhoto} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[ligthgray] ${imageFileUploading && imageFileUploading < 100 && 'opacity-60'}`} />
        </div>
        {imageFileUploadingError && (<Alert color='failure'>{imageFileUploadingError}</Alert>)}
        <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} />
        <TextInput type="email" id="email" placeholder="email" defaultValue={currentUser.email} />
        <TextInput type="password" id="password" placeholder="*********" />
        <Button type='submit' outline gradientDuoTone='purpleToBlue' >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}
