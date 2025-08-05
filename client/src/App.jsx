import React,{ useState } from 'react'
import axios from "axios"

function App() {
  const [file, setFile] = useState(null);
  const [prediction ,setPrediction]=useState(null);
  const [preview, setPreview] = useState(null);
  const [confidence,setConfidence] =useState(null);
  const [loading,setLoading]=useState(null);

  const handleFileChange=(e)=>{
    setFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
    setPrediction(null);
    setConfidence(null);
  };
  const handleUpload=async()=>{
    if(!file) return alert("upload a file first.");

    const formData=new FormData();
    formData.append("file",file);

    try{
      setLoading(true);
      const res=await axios.post("http://localhost:8000/predict",formData,{
        headers:{"Content-Type":"multipart/form-data"},
      });
      setPrediction(res.data.prediction);
      setConfidence(res.data.confidence);
    }catch(err){
      console.error(err);
      alert("something went wrong.");
    }finally{
      setLoading(false);
    }
  }
  return (
    <div className=' min-h-screen flex flex-col items-center justify-center bg-[#6A89A7] p-4'>
      <h1 className='text-3xl font-bold mb-8 text-[#0f0e47]'>Human Emotion Detection</h1>
      
      {!prediction?(
        <div className='bg-white shadow-lg p-8 rounded-lg w-full max-w-md text-center'>
          <input type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className='mb-4'
           />
           <button 
            onClick={handleUpload}
            disabled={loading}
            className='bg-blue-600 text-white px-6 py-2 rounded ring-4 ring-offset-4 ring-blue-600 hover:bg-blue-700 transition disabled:opacity-50 '
           >
            {loading?"Analyzing...":"Submit"}
           </button>
        </div>
      ):(
        <div className='bg-white shadow-lg p-8 rounded-lg w-full max-w-md text-center'>
          <img src={preview} alt="Uploaded" className='w-48 mx-auto rounded mb-4 border-black border-2' />
          <h2 className='text-2xl font-semibold mb-2'>Emotion:{prediction}</h2>
          <p className='text-lg text-gray-600'>Confidence:{confidence?.toFixed(2)}%</p>

          <button
            className='mt-6 text-blue-600 underline'
            onClick={()=>{
              setPrediction(null);
              setFile(null);
              setPreview(null);
              setConfidence(null);
            }} 
          >
            Try another image
          </button>
        </div>
      )}
      
    </div>
  )
}

export default App
