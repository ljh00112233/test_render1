import { Route, BrowserRouter, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import Test from "./Park/Test";
import Register from "./Park/Register";
import UserList from "./Park/UserList";
import Login from "./Park/Login";
import AiDiary from "./Lee/AiDiary";
import HandDiary from "./Lee/HandDiary";
import ResultAiDiary from "./Lee/ResultAiDiary";
import ResultHandDiary from "./Lee/ResultHandDiary";
import { EnvProvider } from "./Lee/EnvContext";

const App = () => { //라우터 설정
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/UserList" element={<UserList />} />
          <Route path="/HandDiary" element={<EnvProvider><HandDiary /></EnvProvider>} />
          <Route path="/AiDiary" element={<EnvProvider><AiDiary /></EnvProvider>} />
          <Route path="/ResultHandDiary" element={<EnvProvider><ResultHandDiary /></EnvProvider>} />
          <Route path="/ResultAiDiary" element={<EnvProvider><ResultAiDiary /></EnvProvider>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};


export default App;
