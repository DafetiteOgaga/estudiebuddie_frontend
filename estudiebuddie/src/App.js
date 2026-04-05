import './App.css';
import { AppRoutes } from './routes/route';
import { ToastContainer } from 'react-toastify';
import './assets/css/esb-style.css';
import './assets/css/esb-responsive.css';
import { useCreateStorage } from './hooks/persistToStorage';
import { useDevice } from './contexts/deviceTypeContext';

import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash, faCircleCheck, faCheck, faTimes,
  faBars, faCopy, faArrowsRotate, faDownload, faGear, faCogs,
  faFileCirclePlus, faTrash, faTrashCan, faEraser, faXmark,
  faPaperPlane, faCheckCircle, faUser, faPlus, faMinus,
  faCirclePlus, } from "@fortawesome/free-solid-svg-icons";
library.add(
  faEye, faEyeSlash, faCircleCheck, faCheck,
  faTimes, faBars, faCopy, faArrowsRotate,
  faDownload, faGear, faCogs, faFileCirclePlus,
  faTrash, faTrashCan, faEraser, faXmark,
  faPaperPlane, faCheckCircle, faUser, faPlus,
  faMinus, faCirclePlus,
);

function App() {
  // const { lStorage, sStorage } = useCreateStorage()
  // lStorage.expiredSoRemove('pulled-staffs', 1000*60*60*2)
  console.log('App rendered');
  const { label } = useDevice();
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
