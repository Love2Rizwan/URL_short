import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
    const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };
    const [inputs, setInput] = useState({
      longUrl:""
    });


         const handleChange = (e) => {
           setInput({
             ...inputs,
             [e.target.name]: e.target.value,
           });
         };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(
              "http://localhost:5173/localhost:8080/url/shorten",
              inputs
            );
            console.log(res.data)
            
        } catch (err) {
            toast.error(err.response.data,toastOptions)
            
        }
        


     
    }
    console.log("input", inputs)
     console.log("setInput", setInput);
    

  return (
      <div>
          <input placeholder='Enter LongURL' name='longUrl' onChange={handleChange}/>
          <button onClick={handleSubmit}>Submit </button>
          <h3>Short URL</h3>
        <ToastContainer/>
          
    </div>
  )
}

export default HomePage