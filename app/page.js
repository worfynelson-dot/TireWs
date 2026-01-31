'use client';
import { useState, useRef } from 'react';

export default function Tirews() {
  const fileInput = useRef(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileInput.current?.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setUrl('');

    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
        headers: { 'content-type': file.type }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      // Create the clean short link based on your domain
      const shortLink = `${window.location.origin}/${data.url.split('/').pop()}`;
      setUrl(shortLink);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex flex-col items-center justify-center font-mono p-4 text-black">
      <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] w-full max-w-sm">
        <h1 className="text-5xl font-black italic tracking-tighter mb-4">TIREWS</h1>
        
        <div className="bg-black text-white p-3 text-[10px] mb-6 font-bold leading-tight">
          MAX SIZES:<br/>
          IMG: 12MB | VID: 45MB | FILE: 20MB
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <input 
            type="file" 
            ref={fileInput} 
            className="w-full text-xs border-2 border-black p-4 bg-gray-50 cursor-pointer"
          />
          <button 
            disabled={loading}
            className="w-full bg-[#4a90e2] text-white border-2 border-black font-black p-3 shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all disabled:bg-gray-400"
          >
            {loading ? 'UPLOADING...' : 'UPLOAD'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-2 bg-red-100 border-2 border-red-600 text-red-600 text-[10px] font-bold">
            ERROR: {error}
          </div>
        )}

        {url && (
          <div className="mt-8 border-t-4 border-black pt-6">
            <p className="text-[10px] font-black uppercase mb-2">Share Link:</p>
            <input 
              readOnly 
              value={url} 
              className="w-full bg-gray-100 border-2 border-black p-2 text-xs mb-2"
              onClick={(e) => e.target.select()}
            />
            <button 
              onClick={() => { navigator.clipboard.writeText(url); alert('Copied!'); }}
              className="text-[10px] font-bold underline hover:text-blue-600"
            >
              CLICK TO COPY LINK
            </button>
          </div>
        )}
      </div>
      <footer className="mt-8 text-[10px] text-gray-500 font-bold uppercase">
        © {new Date().getFullYear()} Tirews Hosting
      </footer>
    </div>
  );
}
