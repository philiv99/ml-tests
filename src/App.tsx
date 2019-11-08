import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane, IonFooter, IonToolbar, IonTitle } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AppPage } from './AppDeclarations';

import Menu from './components/Menu';
import Home from './pages/Home';
import Classification from './pages/Classification';
import TransferLearning from './pages/TransferLearning';
import List from './pages/List';
import { home, list } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/home',
    icon: home
  },
  {
    title: 'Experiments',
    url: '/home/list',
    icon: list
  }
];


const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonSplitPane contentId="main">
        <Menu appPages={appPages} />
        <IonRouterOutlet id="main">
          <Route path="/home" component={Home} exact={true} />
          <Route path="/Classification" component={Classification} exact={true} />
          <Route path="/TransferLearning" component={TransferLearning} exact={true} />
          <Route path="/home/list" component={List} exact={true} />
          <Route path="/" render={() => <Redirect to="/home" exact={true} /> } />
        </IonRouterOutlet>
      </IonSplitPane>
    </IonReactRouter>
  </IonApp>
);

export default App;
