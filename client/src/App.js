import "./App.css";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import MainPage from "./layouts";

function App() {
  return (
    <>
      <BrowserRouter>
        <Route exact path="/" component={MainPage} />
        <Route path="/:page" component={MainPage} />
      </BrowserRouter>
    </>
  );
}

export default App;
