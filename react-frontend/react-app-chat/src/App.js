import Login from './login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './signUp'
import Chat from './chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/chat/v1/login/' element={<Login />}></Route>
        <Route path='/chat/v1/signUp/' element={<SignUp />}></Route>
        <Route path='/chat/v1/chat/' element={<Chat />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
