import { DeleteIcon, FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import{dummyResumeData} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {


   const {user,token} = useSelector(state => state.auth)


 const [allResumes, setallResumes] = useState([])
 const [showCreateResume,setShowCreateResume] = useState(false)
 const [showUploadResume, setshowUploadResume] = useState(false)
 const [title, settitle] = useState('')
 const [resume, setResume] = useState(null)
 const [isLoading, setisLoading] = useState(false)
 const [editResumeId, seteditResumeId] = useState('')

 const colors=['#d97706','#dc2626','#0284c7','#16a34a'];

 const navigate=useNavigate()

 const loadAllResumes = async()=>{
try {
    const {data} = await api.get('/api/users/resumes',{headers:{
      Authorization:token}})
      setallResumes(data.resumes)
  
} catch (error) {
   toast.error(error?.response?.data?.message || error.message)
}
 }

 const createResume = async(event)=>{
 
  try {

    event.preventDefault()
    const {data} = await api.post('/api/resumes/create',{title},{headers:{
      Authorization:token}})

      setallResumes([...allResumes , data.resume ])
      settitle("")
      setShowCreateResume(false)
     navigate(`/app/builder/${data.resume._id}`)

    
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
  }
 }

 const uploadResume = async(event)=>{

  event.preventDefault()
  setisLoading(true)
  try {
    const resumeText = await pdfToText(resume)
     const {data} = await api.post('/api/ai/upload-resume',{title,resumeText},{headers:{
      Authorization:token}})
      settitle('')
      setResume(null)
      setshowUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    
  } catch (error) {
     toast.error(error?.response?.data?.message || error.message)
  }
  setisLoading(false)
    
  }
 

 const editTitle = async(event)=>{

  try {
      event.preventDefault()
       const {data} = await api.put(`/api/resumes/update`,{resumeId:editResumeId,resumeData:{title}},{headers:{
      Authorization:token}})

      setallResumes(allResumes.map(resume => resume._id === editResumeId ? {...resume,title}:resume))
      settitle('')
      seteditResumeId('')
    toast.success(data.message)

  } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
  }

 }

 const deleteResume = async(resumeId)=>{

  const confirm = window.confirm('Are you sure you want to delete this resume?')

try {
    if(confirm){
     const {data} = await api.delete(`/api/resumes/delete/${resumeId}`,{headers:{
      Authorization:token}})
      setallResumes(allResumes.filter(resume => resume._id !==resumeId))
      toast.success(data.message)
  
  }
  
} catch (error) {
  toast.error(error?.response?.data?.message || error.message)
}
 }

 useEffect(()=>{
loadAllResumes()
 },[])
console.log(resume)
 
  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>
       <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>Welcome, Ayush Singh</p>

<div className="flex gap-4">
  <button onClick={()=>setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>

    <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full'/>
    <p className='text-sm group-hover:text-indigo-600 transition-all duration-300'>Create Resume</p>
  </button>

  <button onClick={()=> setshowUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>

    <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full'/>
    <p className='text-sm group-hover:text-purple-600 transition-all duration-300'>Upload Existing</p>
  </button>
 
    
</div>

<hr className='border-slate-300 my-6 sm:w-[305px]' />

<div className='grid grid-cols-2 sm:flex flex-wrap gap-4'>

{allResumes.map((resume,index)=>{
  const baseColor = colors[index%colors.length];
  return(
  <button key={index} onClick={()=>navigate(`/app/builder/${resume._id}`)} className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer' style={{background:`linear-gradient(135deg,${baseColor}10,${baseColor}40)`,borderColor:baseColor+'40'}}>

 <FilePenLineIcon className='size-7 group-hover:scale-105 transition-all' style={{color:baseColor}}/>

 <p className='text-sm group-hover:scale-105 transition-all    text-center' style={{color:baseColor}}>
  
  {resume.title}

 </p>

 <p className='absolute bottom-1 text-[11px] text-slate-400 group-hover:text-shadow-slate-500 transition-all duration-300 px-2  text-center' style={{color:baseColor+'90'}}>
  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
 </p>
 {/* dlt or remove icon */}
 <div onClick={e => e.stopPropagation()} className='absolute top-1 right-1 group-hover:flex items-center hidden'>

<TrashIcon onClick={()=> deleteResume(resume._id)} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors'/>
<PencilIcon onClick={()=>{
  seteditResumeId(resume._id); settitle(resume.title)
}} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors'/>
 </div>
  </button>
  )
})}

</div>

   {showCreateResume && (
     <form onSubmit={createResume} onClick={()=>setShowCreateResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
      <div onClick={e=>e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
        <h2 className='text-xl font-bold mb-4'>Create a Resume</h2>
        <input onChange={(event)=>{
         settitle(event.target.value) 
        }} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>
        <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Create Resume</button>
      
        <XIcon onClick={()=>{
          setShowCreateResume(false); settitle('')
        }} className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'/>
      </div>
     </form>
   )}

   {editResumeId && (
     <form onSubmit={editTitle} onClick={()=>seteditResumeId('')} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
      <div onClick={e=>e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
        <h2 className='text-xl font-bold mb-4'>Edit Resume Title</h2>
        <input onChange={(event)=>{
         settitle(event.target.value) 
        }} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>
        <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Update</button>
      
        <XIcon onClick={()=>{
         seteditResumeId('') ; settitle('')
        }} className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'/>
      </div>
     </form>
   )}


   {showUploadResume && (

     <form onSubmit={uploadResume} onClick={()=>setshowUploadResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
      <div onClick={e=>e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
        <h2 className='text-xl font-bold mb-4'>Upload Resume</h2>

        <input onChange={(event)=>{
         settitle(event.target.value) 
        }} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>

   <div>
    <label htmlFor="resume-input" className='block text-sm text-slate-700'>
      Select resume file
      <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors'>
{
  resume ? (
    <p className='text-gray-700
    '>{resume.name}</p>
  ): (
    <>
    <UploadCloudIcon className='size-14 stroke-1'/>
    <p>Upload Resume</p>
    </>
  )
}
      </div>
    </label>
    <input type="file" id="resume-input" accept='.pdf' hidden onChange={(e)=> setResume(e.target.files[0])}/>
   </div>

        <button disabled={isLoading} className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex justify-center items-center gap-2'>
          {isLoading && <LoaderCircleIcon className='size-4 text-white animate-spin'/>}
          {isLoading ? 'Uploading...':' Upload Resume'}
         
          </button>
      
        <XIcon onClick={()=>{
          setshowUploadResume(false); settitle('')
        }} className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'/>
      </div>
     </form>

   )}

 

      </div>
    </div>
  
  )
    
}

export default Dashboard
