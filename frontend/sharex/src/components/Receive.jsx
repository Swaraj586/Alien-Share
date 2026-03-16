import React from 'react'
import { useState } from 'react'
import axios from 'axios';
function Receive({onUploadSuccess}) {
  const [isPasswordReq,setIsPasswordRequired] = useState(false);
  const [code,setCode] = useState("");
  const [pass,setPass] = useState("");
  const [files,setFiles] = useState(null);
  const handleChange = (e)=>{
    const value = e.target.value;
    if(/^\d*$/.test(value) && value.length <= 4){
      setCode(value);
    }
    
  }
  const handlePassword = (e)=>{
    const value = e.target.value;
    setPass(value);
    
  }

  const handleSubmit = async ()=>{
        if(code.length!==4) return;
        try{
            const config = {
              responseType: 'blob',
            }
        if(isPasswordReq)
        {
          if(!pass)
          {
            alert("password cannot be null");
            return;
          }
          config.params={password: pass};
        }
        
            const response = await axios.get(`http://localhost:8080/downloadM/${code}`,config);
            
            if(onUploadSuccess){
              onUploadSuccess();
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
            let filename = '';
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
    
              
              const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
              if (fileNameMatch && fileNameMatch.length === 2) {
                filename = fileNameMatch[1];
                console.log(filename)
              }
            }
            setFiles({
              filename: filename,
              blob: new Blob([response.data],{ type: response.headers['content-type'] })
            })
           
            
            
        
    } catch(error){
        if (error.response && error.response.status === 401) {
        
        const errorMessage = await error.response.data.text();
        
        if (errorMessage === "Missing password.") {
          setIsPasswordRequired(true);
        } else if (errorMessage === "Invalid password.") {
          alert("Invalid Password!!!");
        }
        return; 
      }

      console.error('Download Failed', error);
      alert('Download failed.');
    }
    
};

const handleDownload = ()=>{
  if(!files) return;
  const url = window.URL.createObjectURL(files.blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', files.filename); 
  document.body.appendChild(link);
  link.click();
  link.remove();
}
  return (
    <>
    <div className='flex flex-col justify-between h-full items-center'>
      <div className='flex gap-5'>
        <label htmlFor="code" className="text-white text-4xl">UFO code: </label>
        <input className="text-white text-4xl border-2 rounded-4xl p-2 w-40 text-center" type="text" maxLength="4" value={code} onChange={handleChange}/>
        <button onClick={handleSubmit} className='h-14 w-64 text-xl font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-900/20'>Fetch</button>        
      </div>
      {isPasswordReq && <div>
          <label htmlFor="code" className="text-white text-4xl">Password: </label>
        <input className="text-white text-4xl border-2 rounded-4xl p-2 w-40 text-center" type="text" maxLength="4" value={pass} onChange={handlePassword}/>
        
        </div>}
      {files && <div className='flex flex-col gap-5 w-full justify-around items-center'>
        <h1 className='text-4xl text-white '>Files Fetched</h1>
        <div className='flex w-full justify-around items-center'>
        <strong className='text-2xl text-white '>{files.filename}</strong>
        <button onClick={handleDownload} className='h-14 w-64 text-xl font-semibold bg-gray-600 hover:bg-gray-500 active:scale-95 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-blue-900/20'>Download</button>
        </div>
        </div>}

    </div>
      


    </>
  )
}

export default Receive