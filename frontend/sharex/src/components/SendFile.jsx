import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UploadCloud, Shield, X, ShieldCheck, Eye, EyeOff } from 'lucide-react';

function SendFile({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState([]);
  const [code, setCode] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false); // Toggle for input
  const [showFinalPass, setShowFinalPass] = useState(false); // Toggle for result screen

  const handleFileChange = (e) => {
    
    setSelectedFile([...selectedFile, ...Array.from(e.target.files)]);
    e.target.value = null; 
  };
  const handleSubmit = async () => {
    if (selectedFile.length === 0) return;
    const formData = new FormData();
    if (isChecked) {
      if (!password) return alert("Set a security key");
      formData.append('password', password);
    }
    selectedFile.forEach(file => formData.append('file', file));

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/uploadM`, formData);
      if (onUploadSuccess) onUploadSuccess();
      await new Promise(r => setTimeout(r, 2000));
      setCode(response.data);
    } catch (error) {
      alert('Transmission failed.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      {code === null ? (
        <>
          {/* ... existing header logic ... */}
          <div className="flex items-center justify-between bg-zinc-800/80 p-4 rounded-2xl border border-zinc-700">
            <div className="flex items-center gap-2">
              {isChecked ? <ShieldCheck className="text-[rgb(141,167,175)]" /> : <Shield className="text-zinc-500" />}
              <span className="text-white font-semibold">Secure Uplink</span>
            </div>
            <button 
              onClick={() => setIsChecked(!isChecked)}
              className={`w-12 h-6 rounded-full transition-colors ${isChecked ? 'bg-[rgb(141,167,175)]' : 'bg-zinc-600'} relative`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isChecked ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {isChecked && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                placeholder="Set Transmission Password"
                className="w-full bg-zinc-800 border border-emerald-500/30 p-3 pr-12 rounded-xl text-white outline-none focus:border-emerald-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-emerald-400 transition-colors"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </motion.div>
          )}

          {/* ... existing file upload logic ... */}
          <label className="border-2 border-dashed border-zinc-700 hover:border-[rgb(24,99,112)] transition-all rounded-3xl h-48 flex flex-col items-center justify-center cursor-pointer group bg-zinc-800/30">
            <UploadCloud size={48} className="text-zinc-500 group-hover:text-[rgb(24,99,112)] transition-colors" />
            <span className="text-zinc-400 mt-2">Drop artifacts here</span>
            <input type="file" className="hidden" multiple onChange={handleFileChange} />
          </label>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {selectedFile.map((file, i) => (
              <div key={i} className="flex justify-between items-center bg-zinc-800 p-3 rounded-xl">
                <span className="text-white text-sm truncate w-40">{file.name}</span>
                <button onClick={() => setSelectedFile(selectedFile.filter((_, idx) => idx !== i))}><X size={16} className="text-red-400" /></button>
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={selectedFile.length === 0} className="py-4 bg-[rgb(24,99,112)] text-white rounded-2xl font-bold disabled:opacity-50 active:scale-95 transition-transform">
            BEAM UP
          </button>
        </>
      ) : (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-10">
          <p className="text-emerald-400 text-sm tracking-widest mb-2 font-mono">UFO CODE</p>
          <h1 className="text-7xl font-black text-white tracking-tighter mb-6">{code}</h1>
          
          {isChecked && (
            <div className="flex flex-col items-center gap-2 bg-zinc-800/50 p-4 rounded-2xl border border-emerald-900/20">
              <span className="text-zinc-500 text-xs uppercase font-bold">Security Key</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono text-amber-200 tracking-widest">
                  {showFinalPass ? password : "••••••••"}
                </span>
                <button 
                  onClick={() => setShowFinalPass(!showFinalPass)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  {showFinalPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}
          <button onClick={() => window.location.reload()} className="mt-8 text-zinc-500 hover:text-emerald-400 text-sm font-medium transition-colors">Generate New Beam</button>
        </motion.div>
      )}
    </div>
  );
}

export default SendFile;