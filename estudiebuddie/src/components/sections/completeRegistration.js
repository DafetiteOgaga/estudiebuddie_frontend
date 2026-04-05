import { useState, useEffect, useRef, useCallback } from "react";
import { FetchFromServer } from "../../hooks/FetchFromServer";
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { justNumbers, removeWhiteSpace } from "../../hooks/formHooks";
import { sentenceCase, titleCase } from "../../hooks/changeCase";
// import { ImageCropAndCompress } from "../../hooks/imgCompressAndCrop/ImageCropAndCompress";
// import { useUploadToImagekit } from "../../hooks/imagekit/uploadToImageKit"; 
import { Spinner } from "../../hooks/spinner/spinner";
import { useCreateStorage } from "../../hooks/persistToStorage";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from "../../contexts/authContext";
import { useDevice } from "../../contexts/deviceTypeContext";

const formValues = {
	// first_name: "",
	// last_name: "",
	// username: "",
	// email: "",
	// mobile_no: "",
	// role: "",
	// about: "",
	// gender: "",
	password: "",
	confirm_password: "",
}
const roleArray = [
	'Student',
	'Teacher'
]
const genderArray = [
	'Male',
	'Female'
]
const formPassword = [
	{
		name: "password",
		required: true,
		disabled: false,
		type: "password",
		placeholder: "New Password",
		width: "70%",
		case: null,
		password: "password",
	},
	{
		name: "confirm_password",
		required: true,
		disabled: false,
		type: "password",
		placeholder: "Confirm New Password",
		width: "70%",
		case: null,
		password: "password",
	},
	// {
	// 	name: "old_password",
	// 	required: true,
	// 	disabled: false,
	// 	type: "password",
	// 	placeholder: "Old Password",
	// 	width: "70%",
	// 	case: null,
	// 	password: "old_password",
	// },
]
// let initFormHead = [
// 	{
// 		name: "first_name",
// 		required: true,
// 		disabled: false,
// 		type: "text",
// 		placeholder: "First name",
// 		width: "70%",
// 		case: null,
// 	},
// 	{
// 		name: "last_name",
// 		required: false,
// 		disabled: false,
// 		type: "text",
// 		placeholder: "Last name",
// 		width: "70%",
// 		case: null,
// 	},
// 	{
// 		name: "email",
// 		required: true,
// 		disabled: false,
// 		type: "email",
// 		placeholder: "Email Address",
// 		width: "70%",
// 		case: null,
// 	},
// 	{
// 		name: "mobile_no",
// 		required: false,
// 		disabled: false,
// 		type: "tel",
// 		placeholder: "Mobile Number",
// 		width: "70%",
// 		case: null,
// 	},
// 	{
// 		name: "role",
// 		required: true,
// 		disabled: false,
// 		type: "select",
// 		placeholder: "Role",
// 		width: "11%",
// 		options: roleArray,
// 		case: "title",
// 	},
// 	{
// 		name: "gender",
// 		required: true,
// 		disabled: false,
// 		type: "select",
// 		placeholder: "Gender",
// 		width: "11%",
// 		options: genderArray,
// 		case: "title",
// 	},
// 	{
// 		name: "password",
// 		required: true,
// 		disabled: false,
// 		type: "password",
// 		placeholder: "Password",
// 		width: "70%",
// 		case: null,
// 	},
// 	{
// 		name: "confirm_password",
// 		required: true,
// 		disabled: false,
// 		type: "password",
// 		placeholder: "Confirm Password",
// 		width: "70%",
// 		case: null,
// 	},
// 	{
// 		name: "username",
// 		required: false,
// 		disabled: false,
// 		type: "text",
// 		placeholder: "Username",
// 		width: "70%",
// 		case: null,
// 	},
// 	{
// 		name: "about",
// 		required: false,
// 		disabled: false,
// 		type: "text",
// 		placeholder: "About me",
// 		width: "70%",
// 		case: null,
// 	},
// ]
// const dyName = ['totalQs']
// const checkIcons = {
// 	// loading: null,
// 	available: <FontAwesomeIcon icon="check" className="checkers-icons"/>,
// 	not_available: <FontAwesomeIcon icon="times" className="checkers-icons"/>,
// }
// function isValidEmail(email) {
// 	if (!email) return false; // empty string is invalid

// 	// Simple regex for common email patterns
// 	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 	return regex.test(email);
// }
// const validateFieldsArr = ["email", "username"]
// const allowSpaces = ['about', 'school']

function CompleteRegistration() {
	// const [hasCode, setHasCode] = useState(false);
	// const [initRole, setInitRole] = useState('')
	// const [formHead, setFormHead] = useState(initFormHead)
	const { label, width, isMobileDev768 } = useDevice();
	// const isMobileDev768 = deviceInfo.width<=768
	// console.log({deviceInfo})
	const { loggedIn, setLoggedIn } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const from = location.state?.from?.pathname;
	// const { lStorage, sStorage } = useCreateStorage()
	const [loading, setLoading] = useState(false);
	// const uploadToCloud = useUploadToImagekit()
	// const [uploadedProfileImg, setUploadedProfileImg] = useState(null)
	const [passwordCheckError, setPasswordCheckError] = useState(null)
	const checkPasswords = usePasswordCheck()
	const [formData, setFormData] = useState(formValues);
	// const [showPassword, setShowPassword] = useState(false);
	// const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	// const [emailCheckResponse, setEmailCheckResponse] = useState(null)
	// const [usernameCheckResponse, setUsernameCheckResponse] = useState(null)
	// // const { checkExistence, availabilityResponse, availabilityLoading, availabilityError } = useEmailAndUsernameChecker();
	// const [showOldPassword, setShowOldPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleChange = async (e) => {
		let { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: removeWhiteSpace(value),
		}))
	};
	// console.log('aaaaa')
	useEffect(()=> {
		setPasswordCheckError(checkPasswords(
			formData.password,
			formData.confirm_password,
			formData,
		))
	}, [formData.password, formData.confirm_password])
	// console.log('bbbbb')

	const submitHandler = async (e) => {
		e.preventDefault(); // prevent default page refresh
		setLoading(true)
		const cleanedData = {...formData};

		const password = cleanedData.password?.trim();
		const confirmPassword = cleanedData.confirm_password?.trim();
		if (password &&
			confirmPassword &&
			password === confirmPassword) {
				console.log('passwords match')
				delete cleanedData.confirm_password
		} else {
			console.error('passwords do not match')
			return
		}
		console.log({
			formData,
			// uploadedProfileImg,
			cleanedData,
		})

		const endpoint = 'user/update/?must_change_password=true'
		const res = await FetchFromServer(endpoint, 'POST', cleanedData, true)
		console.log(
			'Form submitted with data:',
			{
				cleanedData,
				res,
			});
		if (res.ok) {
			toast.success('Success')
			// lStorage.setItem('user', res.data)
			setFormData(formValues)
			setLoggedIn(res.ok)
			// if (from === "/login") {
				navigate("/", { replace: true });
			// } else {
			// 	navigate(-1);
			// }
			// navigate(-1);
		}
		setLoading(false)
	};

	const disablesendBtn = !(formData.password&&
		formData.confirm_password&&!passwordCheckError)
	console.log({
		formData,
		passwordCheckError: !!passwordCheckError,
		notPass: !formData.password,
		notconf: !formData.confirm_password,
		check: disablesendBtn,
	})
	return (
		<>
			{/* <section className="contact-grid"> */}
			<div className="login-form w33percent glass flex-column">
				{/* <h2>Get In Touch</h2> */}
				<h1>One more more step</h1>
				<div className={`${isMobileDev768?'block':'d-flex'} justify-content-between`}>
					<small className="pl-color">You must change your password to continue</small>
					{/* <CheckBoxBtnUI
					chkText="Got a code?"
					spanClass='pl-color got-a-code'
					checkState={hasCode}
					setCheckState={setHasCode} /> */}
				</div>
				{/* change password */}
				<form onSubmit={(e)=>submitHandler(e, 'password')}
					className={`form-column`}>
						{formPassword.map((input, inpIdx) => {
							// console.log({
							// 	// field: input.name,
							// 	// value: formData[input.name]
							// 	inpIdx
							// })
							return (
								<div key={input.name+inpIdx}
								className={`form-group floating-field mb-0 ${input.type==='password'?'form-password':''}`}>
									<>
										<input
										className="text-center"
										value={formData[input.name]}
										onChange={handleChange}
										// onKeyDown={(e) => {
										// 	if (e.key === ' ') {
										// 		e.preventDefault();
										// 	}
										// }}
										type={
											(input.name==='password'&&showPassword)?'text':
											// (input.name==='old_password'&&showOldPassword)?'text':
											(input.name==='confirm_password'&&showConfirmPassword)?'text':
											input.type}
										id={input.name}
										name={input.name}
										placeholder=" "
										required={input.required}
										disabled={input.disabled}
										/>
										<label style={{
											...((passwordCheckError&&input.type==='password')?{top: '35%'}:{})
										}}>{input.placeholder}{input.required?<sup>*</sup>:null}</label>
									</>
									{/* eye toggler */}
									{(input.name==='password') &&
										<EyeToggler
										show={showPassword}
										passwordToggler={setShowPassword} />}
									{(input.name==='confirm_password') &&
										<EyeToggler
										ErrStyle={{
											...((passwordCheckError&&input.type==='password')?{top: '35%'}:{})
										}}
										show={showConfirmPassword}
										passwordToggler={setShowConfirmPassword} />}
									{/* password match error texts */}
									{(input.password==='password'&&inpIdx===1)?<small
									className="password-error">{passwordCheckError}</small>:null}
								</div>
							)
						})}
						<button
						type="submit"
						disabled={
							loading||(disablesendBtn)}
						className="cta-button profile-btn">
							{loading ?
								<Spinner type={'dot'} /> :
								'Change Pasword'}
						</button>
					</form>
			</div>
		</>
	)
}

function EyeToggler({show, passwordToggler, ErrStyle={}}) {
	return (
		<span
		style={ErrStyle}
		role="button"
		onClick={() => passwordToggler(prev => !prev)}
		className="eye"
		tabIndex={0}
		onKeyDown={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				passwordToggler(prev => !prev);
			}
		}}
		>
		<FontAwesomeIcon
			icon={show ? "eye-slash" : "eye"}
		/>
		</span>
	)
}

function usePasswordCheck () {
	const passwordCheck = (password1, password2, formData=null) => {
		console.log({
			password1,
			password2,
		})
		// return null
		if (password1 !== password2) {
			// console.log('22222')
			return 'Passwords do not match'
		}
		// console.log('11111')
		if (password2) {
			if (password1.length < 8) {
				return 'Password must be at least 8 characters long'
			} else if (!/[A-Z]/.test(password1)) {
				return 'Password must contain at least one uppercase letter'
			} else if (!/[a-z]/.test(password1)) {
				return 'Password must contain at least one lowercase letter'
			} else if (!/[0-9]/.test(password1)) {
				return 'Password must contain at least one number'
			}
			// else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
			// 	return 'Password must contain at least one special character'
			// }
			else if (password1.length > 64) {
				return 'Password must be less than 64 characters long'
			} else if (password1.includes(' ')) {
				return 'Password must not contain spaces'
			} else if (password1.toLowerCase().includes('password')) {
				return 'Password must not contain the word "password"'
			}
			if (formData) {
				if (formData.username && (password1.toLowerCase().includes(formData.username.toLowerCase())||
					formData.username.toLowerCase().includes(password1.toLowerCase()))) {
					return 'Password must not be the same or include username'
				} else if (formData.first_name && (password1.toLowerCase().includes(formData.first_name.toLowerCase())||
					formData.first_name.toLowerCase().includes(password1.toLowerCase()))) {
					return 'Password must not contain your first name'
				} else if (formData.last_name && (password1.toLowerCase().includes(formData.last_name.toLowerCase())||
					formData.last_name.toLowerCase().includes(password1.toLowerCase()))) {
					return 'Password must not contain your last name'
				}
			}
		}
		// else {
		// 	return null
		// }
		// console.log('zzzzz')
		return null
	}
	return passwordCheck
}

// function useEmailAndUsernameChecker() {
// 	const [availabilityResponse, setAvailabilityResponse] = useState(null);
// 	const [availabilityLoading, setAvailabilityLoading] = useState(false);
// 	const [availabilityError, setAvailabilityErrorError] = useState(null);
// 	const debounceTimer = useRef(null);

// 	// This is the function you can pass around and call manually
// 	const checkExistence = useCallback(async (key, value) => {
// 		return new Promise((resolve) => {

// 			// debounce setup
// 			// clears previous timer
// 			if (debounceTimer.current) clearTimeout(debounceTimer.current);

// 			// set a new one
// 			debounceTimer.current = setTimeout(async () => {
// 				if (!key || !value) {
// 					resolve({
// 						availabilityLoading: false,
// 						availabilityResponse: null,
// 						availabilityError: null
// 					});
// 					return;
// 				}

// 				setAvailabilityLoading(true);
// 				setAvailabilityErrorError(null);
// 				setAvailabilityResponse(null)

// 				try {
// 					const queryString = new URLSearchParams({ [key]: value }).toString();
// 					const endpoint = `user/check-${key}?${queryString}`;

// 					console.log({
// 						queryString,
// 						endpoint
// 					})
// 					const response = await FetchFromServer(endpoint);
// 					console.log({response})

// 					setAvailabilityResponse(response?.data);

// 					resolve({
// 						availabilityLoading: false,
// 						availabilityResponse: response?.data,
// 						availabilityError: null
// 					});
// 				} catch (err) {
// 					setAvailabilityErrorError(err);
// 					setAvailabilityResponse(null);
// 					resolve({
// 						availabilityLoading: false,
// 						availabilityResponse: null,
// 						availabilityError: err
// 					});
// 				} finally {
// 					setAvailabilityLoading(false);
// 				}
// 			}, 1000);
// 		})
// 	}, []);

// 	return { checkExistence, availabilityResponse, availabilityLoading, availabilityError };
// }

// function CheckBoxBtnUI({checkState, setCheckState, spanClass='', chkText='checkbox display msg.'}) {
// 	return (
// 		<span className={spanClass}
// 		>{chkText}
// 		<input
// 			type="checkbox"
// 			checked={checkState}
// 			onChange={(e) => setCheckState(e.target.checked)}
// 		/>
// 		</span>
// 	)
// }

export { CompleteRegistration };