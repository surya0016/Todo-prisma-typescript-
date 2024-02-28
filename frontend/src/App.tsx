import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SignIn from './pages/SignIn'
import Signup from './pages/Signup'
import Todo from './pages/Todo'
import {  ContextProvider } from './context/Context'

function App() {

  return (
    <>
    {/* @ts-ignore */}
      <ContextProvider>
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<Todo/>}/>
              <Route path='/signin' element={<SignIn/>}/>
              <Route path='/signup' element={<Signup/>}/>
            </Routes>
          </BrowserRouter>  
      </ContextProvider>
    </>
  )
}

export default App
