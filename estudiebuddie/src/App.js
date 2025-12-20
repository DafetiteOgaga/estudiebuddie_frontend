// import logo from './logo.svg';
import './App.css';
// import { Index } from './components';
// import { Courses } from './components/courses';
// import { Blog } from './components/blog';
// import { Contact } from './components/contact';
// import { Element } from './components/elements';
// import { SingleCourse } from './components/single-course';
// import './assets/css/bootstrap.min.css'
// import './assets/css/style.css'
// import './assets/css/owl.carousel.css'
// import './assets/css/font-awesome.min.css'
import { AppRoutes } from './routes/route';
import { ToastContainer } from 'react-toastify';
import { GameResult } from './components/animationComps/confettiAnime';
import { CoinsRain } from './components/animationComps/framerAnime';
import { DancingLion, TalkingAnimal } from './components/animationComps/lottieAnime';
import { LionDance } from './components/animationComps/spriteAnime';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/css/glossy-style.css';

function App() {
  // console.log('App rendered');
  return (
    <>
      <AppRoutes />
      <ToastContainer
      toastClassName="custom_toast"
      position={"top-center"} // {deviceType?"top-center":"top-right"}
      autoClose={3000} // 3 seconds (you can increase if needed)
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      // rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      />
      {/* <Index /> */}
      {/* <Courses /> */}
      {/* <Blog /> */}
      {/* <Contact /> */}
      {/* <Element /> */}
      {/* <SingleCourse /> */}


      {/* <GameResult win={true} /> */}
      {/* <CoinsRain /> */}
      {/* <DancingLion /> */}
      {/* <TalkingAnimal talking={true} /> */}
    </>
  );
}

export default App;
