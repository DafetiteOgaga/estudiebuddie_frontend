import './App.css';
import { AppRoutes } from './routes/route';
import { ToastContainer } from 'react-toastify';
import './assets/css/glossy-style.css';

import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash, faCircleCheck, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
library.add(
  faEye, faEyeSlash, faCircleCheck, faCheck,
  faTimes
);

function App() {
  // console.log('App rendered');
  return (
    <>
      <AppRoutes />
      <ToastContainer
      toastClassName="custom_toast"
      position={"top-right"} // {deviceType?"top-center":"top-right"}
      autoClose={3000} // 3 seconds (you can increase if needed)
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      // rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      />
    </>
  );
}

export default App;
