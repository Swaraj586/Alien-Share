import React,{useState} from 'react';
import axios from 'axios';

function SendFile({onUploadSuccess}) {
    const [selectedFile, setSelectedFile] = useState([]);
    // const [fileSelected, setFileSelected] = useState(0);
    // const [filename, setFilename] = useState([]);
    const [code,setCode] = useState(null);
    const [isChecked,setIsChecked] = useState(false);
    const [password,setPassword] = useState(null);
    const handlePass = (event)=>{
      setPassword(event.target.value);
    }
    const handleSubmit = async ()=>{
        if(selectedFile.length === 0) return;

        const formData = new FormData();
        if(isChecked)
        {
          if(password==null)
          {
            alert("password cannot be null");
            return;
          }
          formData.append('password',password);
        }
        selectedFile.forEach((file)=>{
            formData.append('file',file);
        });
        
        try{
            const response = await axios.post('http://localhost:8080/uploadM',formData,{
                headers: {
                    'Content-Type':'multipart/form-data',
                },
            });
            if(onUploadSuccess){
              onUploadSuccess();
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
            setCode(response.data);
            
            
        
    } catch(error){
        console.error('Error uploading file',error);
        alert('upload failed.');
    }
};
     const handleCancel = (event)=>{
        setSelectedFile(null);
        setCode(null);
        window.location.reload();

     }
    const handleDrop = (event)=>{
      event.preventDefault();
      const droppedFiles = Array.from(event.dataTransfer.files);
      setSelectedFile((prev)=>[...prev, ...droppedFiles]);
      
    }
    const handleDragOver = (event)=>{
      event.preventDefault();
    }
    const handleFile = (event) => {
      const newFiles = Array.from(event.target.files);
      setSelectedFile((prev)=>[...prev,...newFiles]);
    };

    const deleteFile = (index)=>{
      setSelectedFile((prev)=>prev.filter((_,i)=>i!==index));
    };

    const handleCheck = ()=>{
      setIsChecked(!isChecked);
    }
    return (
      <>
        {(code==null) && (
          
          <div className='flex flex-col gap-4'>
            <label htmlFor="check">
              <input type="checkbox" onChange={handleCheck} checked={isChecked} className="w-5 h-5 rounded border-gray-300"/>
              <span className='text-white text-2xl'>Secure</span>
            </label>
            {isChecked && <label htmlFor="pass" className='flex justify-center gap-10 items-center'>
              <span className='text-white text-2xl'>Password: </span>
              <input type="text" onChange={handlePass} placeholder='Enter password' className='text-white text-2xl border-2 rounded-4xl p-2 w-100 text-center'/>

              
            </label>}
            
            <div className="flex items-center justify-center w-full">
            
    <label onDragOver={handleDragOver} onDrop={handleDrop} htmlfor="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium rounded-base cursor-pointer hover:bg-neutral-tertiary-medium">
        <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
            <svg className="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"/></svg>
            <p className="mb-2 text-sm"><span class="font-semibold">Click to upload</span> or drag and drop</p>
        </div>
        <input id="dropzone-file" onChange={handleFile} type="file" class="hidden" multiple/>
    </label>
</div>
          </div>
        )}
        {selectedFile.length > 0 && (code==null) && (
          <div className='flex flex-col justify-center items-center gap-6 py-8'>
            <div className='flex flex-col items-center gap-2'>
              {selectedFile.map((file,index)=>(
                <div>
                  <strong className='text-2xl text-white '>{file.name}</strong>
                  <button onClick={()=> deleteFile(index)} className='text-red-500 h-20 w-20'>X</button>
                </div>
                
              ))}

            </div>
              
              <button className='h-14 w-64 text-xl font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-900/20' onClick={handleSubmit}>Upload</button>
              <button className='h-14 w-64 text-xl font-semibold bg-red-900 hover:bg-red-500 active:scale-95 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-900/20' onClick={handleCancel}>Cancel</button>
          </div>
  
          
        )}

        {(code!=null)&& <div className='flex flex-col gap-10 justify-center'>
          <h1 className='text-7xl text-white'>{code}</h1>
          {isChecked && <h1 className='text-5xl text-amber-200'>Password: {password}</h1>}
        </div>}
      </>
    );
}

export default SendFile