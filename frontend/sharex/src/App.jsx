import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SendFile from "./components/SendFile";
import Receive from "./components/Receive";
import Ufo from "./components/Ufo";
import "./App.css";
import videoSource from "./assets/space.mp4";
import bg from "./assets/bg.png";
import logoImg from "./assets/Logo.png";
import Loader from "./components/Loader";
import Error from "./components/Error";
import { FileLock } from "lucide-react";

function App() {
  const [selected, setSelected] = useState(0);
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
  const wakeUpServer = async (retries = 3) => {
    try {
      console.log(`Server: ${import.meta.env.VITE_BACKEND_URL}/health`);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health`);
      
      if (response.ok) {
        setTimeout(() => {
      setIsLoading(false);
    }, 3000); 
      } 
    } catch (error) {
      if (retries > 0) {
        
        setTimeout(() => wakeUpServer(retries - 1), 3000); 
      } else {
        
        
        
        setHasError(true);
        setIsLoading(false); 
      }
    }
  };

  wakeUpServer();
}, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 5000);
  // }, []);

  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => setSent(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [sent]);
  if(hasError) {
    return <Error />;
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 1. The Video Background */}
      {/* <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src={videoSource} type="video/mp4" />
      </video> */}
      <img src={bg} className="absolute top-0 left-0 w-full h-full object-cover -z-10"></img>
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* 3. Your Main App Content */}
      <div className="min-h-screen text-white flex flex-col items-center p-4 md:p-10 font-sans relative z-10">
      {/* UFO Animation Overlay */}
      <AnimatePresence>
        {sent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-500/10 backdrop-blur-2xl"
          >
            {/* <div className="w-full h-full"><Ufo /></div> */}
            <div className="w-full h-full flex flex-col justify-center"><div className="ufo-app"></div></div>
            <div className="absolute bottom-20 text-[rgb(24,99,112)] font-mono animate-pulse text-xl">BEAMING DATA...</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-xl z-10">
        <header className="text-center mb-10">
          {/* <h1 className="text-4xl font-black tracking-tighter text-white">ALIEN<span className="text-emerald-500">SHARE</span></h1> */}
          <img src={logoImg} alt="AlienShare Logo" className="h-auto max-w-full" />
          <p className="text-zinc-500 text-sm">Secure interstellar file transfer</p>
        </header>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-900 p-1.5 rounded-2xl mb-8 border border-zinc-800">
          <button
            onClick={() => setSelected(0)}
            className={`flex-1 py-3 rounded-xl transition-all font-bold ${selected === 0 ? "bg-[rgb(24,99,112)] text-white shadow-lg" : "text-zinc-500 hover:text-white"}`}
          >
            Send
          </button>
          <button
            onClick={() => setSelected(1)}
            className={`flex-1 py-3 rounded-xl transition-all font-bold ${selected === 1 ? "bg-[rgb(24,99,112)] text-white shadow-lg" : "text-zinc-500 hover:text-white"}`}
          >
            Receive
          </button>
        </div>

        {/* Main Card */}
        <motion.div 
          key={selected}
          initial={{ opacity: 0, x: selected === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl"
        >
          {selected === 0 ? <SendFile onUploadSuccess={() => setSent(true)} /> : <Receive onUploadSuccess={() => setSent(true)} />}
        </motion.div>
      </div>

      <motion.div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-6 mt-10 md:p-10 shadow-2xl flex-col text-center">
          <p className="text-red-600 flex gap-2"><FileLock></FileLock>Use the Secure Uplink feature to make your file transmission more secure by adding a password.</p>
          <p className="text-[rgb(141,167,175)]">Max share limit 50Mb.</p>
          <p className="text-[rgb(141,167,175)]">The UFO code is valid till 24hrs only.</p>
          
      </motion.div>
    </div>
    <p className="flex gap-2 justify-center text-white">&copy; {new Date().getFullYear()} snp. All rights reserved.</p>
      </div>
    
  );
}

export default App;
