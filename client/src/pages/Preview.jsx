import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { ArrowLeftIcon, Loader } from 'lucide-react'
import ResumePreview from '../components/ResumePreview'
import api from '../configs/api'

const Preview = () => {
  const {resumeId} = useParams()

  const [resumeData, setresumeData] = useState(null)
  const [isLoading, setisLoading] = useState(true)

const loadResume =async ()=>{

  try {
    const {data} = await api.get('/api/resumes/public/'+resumeId)
    setresumeData(data.resume)
    
  } catch (error) {
    console.log(error.message)
  }finally{
    setisLoading(false)
  }
}

useEffect(()=>{
  loadResume()
},[])

  return resumeData? (
    <div className='bg-slate-100'>
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview data={resumeData} accentColor={resumeData.accent_color} template={resumeData.template} 
        classes='py-4 bg-white'/>
      </div>
    
    </div>
  ):(
    <div className="">

 {isLoading ? <Loader/>:(
  <div className='flex flex-col items-center justify-center h-screen'>
    <p className='text-center text-6xl text-slate-400 font-medium'>Resume not found</p>

  <a href="/" className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors'>
      <ArrowLeftIcon className='mr-2 size-4'/>
      go to home page
  </a>
  </div>
 ) }
    </div>
  )
}

export default Preview
