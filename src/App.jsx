import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { IpProvider } from './contexts/IpContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import IpInput from './components/IpInput';
import NotFound from './components/NotFound.jsx';

import './App.css';
import '../src/styles/ip-input.css';
import '../src/styles/footer.css';
import '../src/styles/NotFound.css';

function App() {
  return (
    <IpProvider>
      <Router>
        <div className="App">
          <div className="circle-container"></div>
          <Header />
          <Routes>
            <Route path="/" element={
              <>
                <div className="center">
                  <IpInput />
                </div>
                <Tabs />
              </>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </IpProvider>
  );
}

export default App;