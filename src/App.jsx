import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

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
import '../src/styles/AdvanceMode.css'


function App() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.07, // 0 to 1, lower is smoother with more inertia
    });

    return () => {
      scroll.destroy();
    };
  }, []);

  return (
    <IpProvider>
      <Router>
        <div className="App" ref={scrollRef} data-scroll-container>
          <div className="circle-container"></div>
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="center" data-scroll-section>
                    <IpInput />
                  </div>
                  <Tabs />
                </>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </IpProvider>
  );
}

export default App;
