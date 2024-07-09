import './App.css'
import { Route, Routes } from 'react-router-dom';
import { SurveysListPage } from './components/Surveys/SurveysListPage';
import { NoMatch } from './components/NoMatch/NoMatch';
import { SurveyEditor } from './components/Surveys/SurveyEditor/SurveyEditor';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<SurveysListPage />} />
        <Route path="/survey/:id" element={<SurveyEditor />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  )
}

export default App
