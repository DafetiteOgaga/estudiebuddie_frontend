import './App.css';
import { AppRoutes } from './routes/route';
import { ToastContainer } from 'react-toastify';
import './assets/css/esb-style.css';
import './assets/css/esb-responsive.css';
import { useLogo } from './contexts/LogoContext';
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
  // useEffect(() => {
  //   // const shouldUseDark = true; // or dynamic logic

  //   // if (shouldUseDark) {
  //   //   document.documentElement.classList.add("dark-theme");
  //   // } else {
  //   //   document.documentElement.classList.remove("dark-theme");
  //   // }
  // }, []);
  // lStorage.expiredSoRemove('pulled-staffs', 1000*60*60*2)
  console.log('App rendered');
  const { isMobileDev768 } = useDevice();
  const { logo } = useLogo();
  return (
    <>
      <AppRoutes />
      <ToastContainer
      toastClassName="custom_toast"
      // position={"top-right"}
      position={isMobileDev768?"top-center":"top-right"}
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
