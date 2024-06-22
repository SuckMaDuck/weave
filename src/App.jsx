import ReactDOM from 'react-dom/client';
import"./css/main.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {LoginProvider} from './contexts/LoginContext.jsx';
import {UserDataProvider} from './contexts/userDataContext.jsx';
import {Companies, Jobs, Login, Overview, Register, ProtectedRoutes, Settings, Support} from "./pages/export.js";


const App = () => {

  return (            

    <BrowserRouter>
        <Routes>
      {/* protected routes */}
            <Route element={<LoginProvider>   <UserDataProvider> <ProtectedRoutes />   </UserDataProvider>     </LoginProvider>}>
                <Route path="/" element={<Overview />}/>
                <Route path="/jobs"  element={<Jobs/>} />
                <Route path="/companies"  element={<Companies/>} />
                <Route path="/settings"  element={<Settings/>} />
                <Route path="/support"  element={<Support/>} />
          </Route>

          <Route path="/login"  element={  <LoginProvider> <Login/> </LoginProvider>} />
          <Route path="/register"  element={<LoginProvider> <Register/> </LoginProvider >} />
        </Routes>
  
      
    </BrowserRouter>




  )
}

export default App