import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Lock,
  Radio,
  Archive,
  Files,
  Eye,
  EyeOff,
} from "lucide-react";
import JSZip from "jszip";
import CodeInput from "./CodeInput";

function Receive({ onUploadSuccess }) {
  const [isPasswordReq, setIsPasswordRequired] = useState(false);
  const [code, setCode] = useState("");
  const [pass, setPass] = useState("");
  const [fileList, setFileList] = useState([]); // Individual unzipped files
  const [originalZip, setOriginalZip] = useState(null); // The raw ZIP blob
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const handleSubmit = async () => {
    if (code.length !== 4) return;
    setLoading(true);
    try {
      const config = { responseType: "blob" };
      if (isPasswordReq) {
        if (!pass) return alert("Password required");
        config.params = { password: pass };
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/downloadM/${code}`,
        config,
      );
      if (onUploadSuccess) onUploadSuccess();

      // Process the ZIP
      const zip = new JSZip();
      const content = await zip.loadAsync(response.data);
      const extractedFiles = [];

      // Iterate through files in the zip
      for (let filename in content.files) {
        const fileData = content.files[filename];
        if (!fileData.dir) {
          const blob = await fileData.async("blob");
          extractedFiles.push({ name: filename, blob });
        }
      }

      setFileList(extractedFiles);
      setOriginalZip({ blob: response.data, name: `AlienShare_${code}.zip` });
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Security Key Required");
        setIsPasswordRequired(true);
      } else {
        alert("Transmission Interrupted. Code might be expired.");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadSingle = (blob, name) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadAllIndividually = () => {
    fileList.forEach((file, index) => {
      setTimeout(() => downloadSingle(file.blob, file.name), index * 200);
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      {/* Input Section */}
      <div className="flex flex-col items-center gap-4">
        <label className="text-[rgb(141,167,175)] flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
          <Radio size={20} className="animate-pulse" /> UFO Code
        </label>
        <CodeInput value={code} onChange={setCode} />
      </div>

      <AnimatePresence>
        {isPasswordReq && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-col gap-2 relative"
          >
            <input
              type={showPass ? "text" : "password"} // Toggle type here
              placeholder="Security Key"
              className="bg-zinc-800 border border-zinc-700 p-3 pr-12 rounded-xl text-white outline-none focus:border-amber-400 text-center"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
            />

            {/* Visibility Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition-colors"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 bg-[rgb(24,99,112)] hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-emerald-900/40 disabled:opacity-50"
      >
        {loading ? "DECRYPTING..." : "INTERCEPT BEAM"}
      </button>

      {/* Results Section */}
      {fileList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex justify-between items-end px-1">
            <h3 className="text-zinc-500 text-xs uppercase font-bold tracking-tighter">
              Recovered Artifacts ({fileList.length})
            </h3>
          </div>

          {/* Bulk Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => downloadSingle(originalZip.blob, originalZip.name)}
              className="flex items-center justify-center gap-2 p-3 bg-zinc-800 hover:bg-zinc-700 text-amber-200 rounded-xl text-xs font-bold transition-colors border border-amber-900/20"
            >
              <Archive size={16} /> DOWNLOAD ZIP
            </button>
            <button
              onClick={downloadAllIndividually}
              className="flex items-center justify-center gap-2 p-3 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 rounded-xl text-xs font-bold transition-colors border border-emerald-900/20"
            >
              <Files size={16} /> DOWNLOAD ALL
            </button>
          </div>

          {/* Individual File List */}
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {fileList.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="text-emerald-500 shrink-0" size={18} />
                  <span className="text-white text-sm truncate">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => downloadSingle(file.blob, file.name)}
                  className="p-2 text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Receive;
