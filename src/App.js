import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './Store/reducer';
import Home from './Pages/Home/Home';
import DataPrivacyPage from './Pages/DataPrivacyPage.js/DataPrivacyPage';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/privacy-policy" exact component={DataPrivacyPage} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
