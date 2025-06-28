import './App.css';
import { useState,useEffect } from 'react';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Editor } from './components/Editor';
import { Canvas } from './components/Canvas';
import { HomeIcon, LetterTextIcon, PenBox, PenTool, UserCircle2, UserIcon } from 'lucide-react';

function App() {
  const [page,setPage]=useState('home');
  return (
    <>
      <div className='nav-bar'>
        <button onClick={()=>setPage('home')}><HomeIcon></HomeIcon></button>
        <button onClick={()=>setPage('Editor')}><LetterTextIcon></LetterTextIcon></button>        
        <button onClick={()=>setPage('Canvas')}><PenBox></PenBox></button>
        <button onClick={()=>setPage('Profile')}><UserCircle2></UserCircle2></button>
      </div>
      {page==='home' && <Home></Home>}
      {page==='Editor' && <Editor></Editor>}
      {page==='Canvas' && <Canvas></Canvas>}
    </>
  );
}


export default App;
