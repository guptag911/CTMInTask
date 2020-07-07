import React from "react";
import {
  HashRouter,
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import "./App.css";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import PrivateRoute from "./components/privateRoute";
// Pages
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";

const theme = createMuiTheme({
  palette: {
    primary: {
      dark: "#9e1354",
      main: "#feccfe",
      light: "#e84993",
    },
    secondary: {
      dark: "#b2b2b2",
      main: "#ffffff",
      light: "#ffffff",
    },
  },
});
// component

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <HashRouter>
          <Switch>
            <PrivateRoute exact path="/dash" component={Dashboard} />
            <Route path="/" component={Home} />
          </Switch>
        </HashRouter>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
