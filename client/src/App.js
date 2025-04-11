import { Route, BrowserRouter, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import AiDiary from "./Lee/aidiary";

const App = () => { //라우터 설정
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/aidiary" element={<AiDiary />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;