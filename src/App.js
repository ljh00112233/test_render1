import { Route, BrowserRouter, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import AiDiary from "./Lee/aidiary";
import HandDiary from "./Lee/handdiary";
import ResultAiDiary from "./Lee/resultAidiary";
import ResultHandDiary from "./Lee/resultHanddiary";
import { EnvProvider } from "./Lee/envContext";

const App = () => { //라우터 설정
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/handdiary" element={<EnvProvider><HandDiary /></EnvProvider>} />
          <Route path="/aidiary" element={<EnvProvider><AiDiary /></EnvProvider>} />
          <Route path="/resulthanddiary" element={<EnvProvider><ResultHandDiary /></EnvProvider>} />
          <Route path="/resultaidiary" element={<EnvProvider><ResultAiDiary /></EnvProvider>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;