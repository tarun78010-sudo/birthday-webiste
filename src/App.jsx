import { Routes, Route } from 'react-router-dom'
import HomeExperience from './components/HomeExperience.jsx'
import BirthdayHomePage from './components/BirthdayHomePage.jsx'
import StoryPage from './components/StoryPage.jsx'
import WishesPage from './components/WishesPage.jsx'
import MemoriesPage from './components/MemoriesPage.jsx'
import BirthdayLetterPage from './components/BirthdayLetterPage.jsx'
import CakePage from './components/CakePage.jsx'
import GiftPage from './components/GiftPage.jsx'
import FinalePage from './components/FinalePage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeExperience />} />
      <Route path="/birthday-home" element={<BirthdayHomePage />} />
      <Route path="/story" element={<StoryPage />} />
      <Route path="/wishes" element={<WishesPage />} />
      <Route path="/memories" element={<MemoriesPage />} />
      <Route path="/birthday-letter" element={<BirthdayLetterPage />} />
      <Route path="/cake" element={<CakePage />} />
      <Route path="/gift" element={<GiftPage />} />
      <Route path="/finale" element={<FinalePage />} />
    </Routes>
  )
}
