import {  BriefcaseBusiness,  Globe,  Key, Linkedin, LocationEdit, Mail, MapPin, Phone, User, UserIcon } from 'lucide-react'
import React from 'react'

const PersonalInfoForm = ({data,onChange,removeBackground,setRemoveBackground}) => {

    const handleChange = (field,value)=>{
        console.log("Changing field:", field, "value:", value);
         onChange({...data , [field]:value});
    }

    const fields = [
        {Key:"full_name", label:"Full Name" ,icon:User,type:"text",required:true},
        {Key:"email", label:"Email Address" ,icon:Mail ,type:"email",required:true},
        {Key:"phone", label:"Phone Number" ,icon:Phone,type:"tel",},
        {Key:"location", label:"Location" ,icon:MapPin,type:"text",},
      
        {Key:"profession", label:"Profession" ,icon:BriefcaseBusiness,type:"text",},
        {Key:"linkedin", label:"LinkedIn Profile" ,icon:Linkedin,type:"url",},
        {Key:"website", label:"Personal Website" ,icon:Globe,type:"url",}
    ]

  return (
    <div>
      <h3 className='text-lg font-semibold text-gray-900'>Personal Information</h3>
      <p className='text-sm text-gray-600'>Get Started with the personal information</p>

      <div className="flex items-center gap-2">
        <label>
               {data.image ? (
                <img src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image) } alt="user-image" className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80 ' />
               ):(
                <div className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
                    <UserIcon className='size-10 p-2.5 border rounded-full'/>upload user image
                </div>
               )}
               <input type="file" accept="image/jpeg,image/png" className='hidden' onChange={(e)=> handleChange("image", e.target.files[0])}/>
        </label>
        {typeof data.image === 'object' && (
            <div className='flex flex-col gap-1 pl-1 text-sm'>
                <p>Remove Background</p>
                <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                    <input type="checkbox" className='sr-only peer' onChange={()=>setRemoveBackground(prev=> !prev)} checked={removeBackground}/>
                      
                      <div className='w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-gray-600 transition-colors duration-200'></div>

                      <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>

                </label>
            </div>
        )}
        
      </div>
      {/* list of input field */}
    
    {fields.map((field)=>{
       const Icon = field.icon;
       return(
        <div Key={field.Key} className='space-y-1 mt-5'>
            <label className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                <Icon className='size-4'/>
                {field.label}
                {field.required && <span className='text-red-500'>*</span>}
            </label>
            <input type={field.type} value={data[field.Key] || ""} onChange={(e)=>handleChange(field.Key,e.target.value)} className='mt-1 w-full px-3 py-2 border-gray-300 border rounded-lg focus:ring focus:ring-blue-500 outline-none transition-colors text-sm' placeholder={`Enter your ${field.label.toLowerCase()}`} required={field.required} />

        </div>
       )
    })}

    </div>
  )
}

export default PersonalInfoForm
