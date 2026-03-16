import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import SendFile from "./components/SendFile";
import "./App.css";
import Receive from "./components/Receive";
import Ufo from "./components/Ufo";

function App() {
  const [selected, setSelected] = useState(0);
  const [sent, setSent] = useState(false);
  useEffect(()=>{
    if(sent){
      const timer = setTimeout(()=>{
        setSent(false);
      },3000);
      return ()=>clearTimeout(timer);
    }
  },[sent]);
  const handleMode = (e) => {
    const mode = e.target.innerText;
    if (mode == "Send") {
      setSelected(0);
    } else {
      setSelected(1);
    }
  };
  return (
    <>
    <div className="relative min-h-screen overflow-hidden">

      {sent && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          
          <div className="absolute inset-0 z-30 bg-amber-200/10 backdrop-blur-sm animate-pulse" />
          
          <div className="w-full h-full z-50 pointer-events-auto">
            <Ufo />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-10">
        
        <div className="flex gap-3">
          <button
            onClick={handleMode}
            className={`h-20 w-1/2 text-4xl ${selected == 0 ? "bg-amber-50 text-black" : "bg-gray-900 text-white"} bg-amber-50 rounded-3xl`}
          >
            Send
          </button>
          <button
            onClick={handleMode}
            className={`h-20 w-1/2 text-4xl ${selected == 1 ? "bg-amber-50 text-black" : "bg-gray-900 text-white"} bg-amber-50 rounded-3xl`}
          >
            Receive
          </button>
        </div>
        <div className="bg-zinc-900 h-fit rounded-4xl p-15">
          {selected == 0 && <SendFile onUploadSuccess={()=>setSent(true)}/>}
          {selected == 1 && <Receive onUploadSuccess={()=>setSent(true)}/>}
        </div>
      </div>
      </div>
    </>
  );
}

export default App;
