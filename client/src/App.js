import { Route, BrowserRouter, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import AiDiary from "./Lee/aidiary";
import HandDiary from "./Lee/handdiary";

const App = () => { //라우터 설정
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/handdiary" element={<HandDiary />} />
          <Route path="/aidiary" element={<AiDiary />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;