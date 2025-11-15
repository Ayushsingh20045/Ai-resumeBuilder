import { Loader, SparklesIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import {toast}  from 'react-hot-toast'

const ProfessionalSummary = ({data,onChange,setResumeData}) => {

const {token} = useSelector(state => state.auth)
const [isGenerating, setisGenerating] = useState(false)

const generateSummary = async()=>{

    try {
        setisGenerating(true)
        const prompt = `Enhance my professional summery "${data}" `
        const response = await api.post('/api/ai/enhance-pro-sum',{userContent:prompt},{headers:{Authorization:token}})
        setResumeData(prev => ({...prev, professional_summary:response.data.enhanceContent}))
        
    } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
    }
    finally{
        setisGenerating(false)
    }
}

  return (
    <div className='space-y-4'>

        <div className='flex items-center justify-between'>

            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
                <p className='text-sm text-gray-500'>Enter a short introduction about yourself here</p>
            </div>
            <button disabled={isGenerating} onClick={generateSummary} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                {isGenerating?(<Loader className='size-4 animate-spin'/>):(
               <SparklesIcon className='size-4'/>
                )}
                {isGenerating? "Enhancing...":"AI Enhance"}
               
              
            </button>

        </div>

        <div className='mt-6'>
            <textarea rows={7} value={data || ""}  onChange={(e)=>onChange(e.target.value)} className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none' 
            placeholder='Write a short statement about your experience and skills here...'/>
            <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.</p>
        </div>
      
    </div>
  )
}

export default ProfessionalSummary
