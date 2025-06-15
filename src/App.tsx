import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppContent from "./app/AppContent";
import PlayerList from "./features/Player";
import PlayerForm from "./features/Player/PlayerForm";
import TeamsList from "./features/Team";
import TeamForm from "./features/Team/TeamForm";
import HomePage from "./features/HomePage";
import MatchView from "./features/ Match";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />}>
          <Route index element={<HomePage />} />
          {/* <Route path="/player" /> */}
          <Route path="/players" element={<PlayerList />} />
          <Route path="/player/new" element={<PlayerForm />} />
          <Route path="/teams" element={<TeamsList />} />
          <Route path="/team/new" element={<TeamForm />} />
          <Route path="/match" element={<MatchView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
