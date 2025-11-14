import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import QuestionnairePlayer from "./pages/QuestionnairePlayer";
import Results from "./pages/Results";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:id" element={<QuestionnairePlayer />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}
