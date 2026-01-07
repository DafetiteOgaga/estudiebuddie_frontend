import { useState, useEffect, useRef, useCallback } from "react";
import { FetchFromServer } from "../../hooks/FetchFromServer";
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { justNumbers, removeWhiteSpace } from "../../hooks/formHooks";
import { sentenceCase, titleCase } from "../../hooks/changeCase";
import { ImageCropAndCompress } from "../../hooks/imgCompressAndCrop/ImageCropAndCompress";
import { useUploadToImagekit } from "../../hooks/imagekit/uploadToImageKit"; 
import { Spinner } from "../../hooks/spinner/spinner";
import { useCreateStorage } from "../../hooks/persistToStorage";
import { useNavigate } from 'react-router-dom';

const formValues = {
	first_name: "",
	last_name: "",
	username: "",
	email: "",
	mobile_no: "",
	role: "",
	about: "",
	gender: "",
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
const formHead = [
	{
		name: "first_name",
		required: true,
		disabled: false,
		type: "text",
		placeholder: "First name",
		width: "70%",
		case: null,
	},
	{
		name: "last_name",
		required: false,
		disabled: false,
		type: "text",
		placeholder: "Last name",
		width: "70%",
		case: null,
	},
	{
		name: "email",
		required: true,
		disabled: false,
		type: "email",
		placeholder: "Email Address",
		width: "70%",
		case: null,
	},
	{
		name: "mobile_no",
		required: false,
		disabled: false,
		type: "tel",
		placeholder: "Mobile Number",
		width: "70%",
		case: null,
	},
	{
		name: "role",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Role",
		width: "11%",
		options: roleArray,
		case: "title",
	},
	{
		name: "gender",
		required: true,
		disabled: false,
		type: "select",
		placeholder: "Gender",
		width: "11%",
		options: genderArray,
		case: "title",
	},
	{
		name: "password",
		required: true,
		disabled: false,
		type: "password",
		placeholder: "Password",
		width: "70%",
		case: null,
	},
	{
		name: "confirm_password",
		required: true,
		disabled: false,
		type: "password",
		placeholder: "Confirm Password",
		width: "70%",
		case: null,
	},
	{
		name: "username",
		required: false,
		disabled: false,
		type: "text",
		placeholder: "Username",
		width: "70%",
		case: null,
	},
	{
		name: "about",
		required: false,
		disabled: false,
		type: "text",
		placeholder: "About me",
		width: "70%",
		case: null,
	},
]
const checkIcons = {
	// loading: null,
	available: <FontAwesomeIcon icon="check" className="checkers-icons"/>,
	not_available: <FontAwesomeIcon icon="times" className="checkers-icons"/>,
}
function isValidEmail(email) {
	if (!email) return false; // empty string is invalid

	// Simple regex for common email patterns
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
}
const validateFieldsArr = ["email", "username"]

function SignUp() {
	const navigate = useNavigate()
	const { lStorage, sStorage } = useCreateStorage()
	const [loading, setLoading] = useState(false);
	const uploadToCloud = useUploadToImagekit()
	const [uploadedProfileImg, setUploadedProfileImg] = useState(null)
	const [passwordCheckError, setPasswordCheckError] = useState(null)
	const checkPasswords = usePasswordCheck()
	const [formData, setFormData] = useState(formValues);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [emailCheckResponse, setEmailCheckResponse] = useState(null)
	const [usernameCheckResponse, setUsernameCheckResponse] = useState(null)
	const { checkExistence, availabilityResponse, availabilityLoading, availabilityError } = useEmailAndUsernameChecker();

	const handleChange = async (e) => {
		let { name, value } = e.target;
		if (name === 'mobile_no') {
			value = justNumbers(value)
		}
		setFormData((prev) => ({
			...prev,
			[name]: name!=='about'?removeWhiteSpace(value):value,
		}))

		console.log({name: [name]})
		// if (name==='email'||name==='username') {
		// 	console.log('clearing both'.repeat(5))
		// 	setEmailCheckResponse(null)
		// 	setUsernameCheckResponse(null)
		// }
		if (name==='email') {
			console.log('email'.repeat(5))
			if (value.trim()===''||!isValidEmail(value)) {
				console.log('email-empty/invalid'.repeat(5))
				setEmailCheckResponse(null)
			} else if (value) {
				setEmailCheckResponse('loading')
			}
		} else if (name==='username') {
			console.log('username'.repeat(5))
			if (value.trim()==='') {
				console.log('username-empty'.repeat(5))
				setUsernameCheckResponse(null)
			} else if (value) {
				setUsernameCheckResponse('loading')
			}
		}
		if ((name==='email'&&isValidEmail(value))||name==='username') {
			console.log('checking'.repeat(5))
			const response = await checkExistence(name, value);
			if (response) {
				console.log({
					response,       // { loading: false, data: {...}, error: null }
					availabilityResponse,  // last stored in hook state
					availabilityLoading,   // last loading state
					availabilityError,          // last error state
				});
				if (name==='email') {
					console.log('is-email'.repeat(5))
					setEmailCheckResponse(response?.availabilityResponse)
				} else {
					console.log('is-username'.repeat(5))
					setUsernameCheckResponse(response?.availabilityResponse)
				}
			}
		}
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
		const cleanedData = structuredClone(formData);

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
			uploadedProfileImg,
			cleanedData,
		})

		let uploadedProfileDetails
		if (uploadedProfileImg) {
			uploadedProfileDetails = await uploadToCloud({
				selectedFile: uploadedProfileImg?.compressedFile,
				fileName: 'test-profile',
				folder: 'profile',
			})
			cleanedData.image_url = uploadedProfileDetails.url
			cleanedData.fileId = uploadedProfileDetails.fileId
		}

		if (uploadedProfileDetails==='reload') {
			console.error('need to reload!')
			return
		}
		console.log({uploadedProfileDetails})

		const endpoint = 'user/create'
		const res = await FetchFromServer(endpoint, 'POST', cleanedData, true)
		console.log(
			'Form submitted with data:',
			{
				cleanedData,
				res,
			});
		if (res.ok) {
			toast.success('Success')
			lStorage.setItem('user', res.data)
			setFormData(formValues)
			navigate('/login')
		}
		setLoading(false)
	};

	console.log({
		formData,
		emailCheckResponse,
		usernameCheckResponse
		// passwordCheckError,
		// uploadedProfileImg
	})
	return (
		<>
			{/* <section className="contact-grid"> */}
			<div className="login-form sign-up-form glass flex-column">
				{/* <h2>Get In Touch</h2> */}
				<h1>Sign Up</h1>
				<small className="pl-color">Note: Every field with * must be filled</small>
				<form onSubmit={submitHandler}
				className="form-column signup">
					{formHead.map((input, inpIdx) => {
						// console.log({
						// 	field: input.name,
						// 	value: formData[input.name]
						// })
						return (
							<div key={input.name+inpIdx}
							className={`form-group floating-field mb-0 ${input.type==='password'?'form-password':''}`}>
								{/* <span>
								{input.name} | {usernameCheckResponse} | {emailCheckResponse}
								</span> */}
								{input.type==='textarea' ?
								<>
									<textarea
										className="signup"
										value={formData[input.name]}
										onChange={handleChange}
										rows={2}
										// style={{
										// 	height: "auto",
										// 	width: field.width,
										// 	// marginTop: "2rem", // space from inputs above
										// }}
										id={input.name}
										name={input.name}
										placeholder=" "
										required={input.required}
										disabled={input.disabled}
									/>
									<label>{input.placeholder}{input.required?<sup>*</sup>:null}</label>
								</>
								:
								input.type==='select' ?
								<>
									<select
									// style={{width: input.width}}
									// className="text-center"
									value={formData[input.name]}
									onChange={handleChange}
									name={input.name}
									required={input.required}>
										<option value="" disabled hidden>-- {input.placeholder} --</option>
										{input.options.map((sItem, sIdx) => (
											<option key={sIdx} value={titleCase(sItem)}
											className="options">
												{titleCase(sItem)}
											</option>
										))}
									</select>
									<label>{input.placeholder}{input.required?<sup>*</sup>:null}</label>
								</>
								:
								<>
									<input
									className="text-center"
									value={formData[input.name]}
									onChange={handleChange}
									onKeyDown={(e) => {
										if (e.key === ' ' && input.name!=='about') {
											e.preventDefault();
										}
									}}
									type={
										(input.name==='password'&&showPassword)?'text':
										(input.name==='confirm_password'&&showConfirmPassword)?'text':
										input.type}
									id={input.name}
									name={input.name}
									placeholder=" "
									required={input.required}
									disabled={input.disabled}
									/>
									<label htmlFor={input.name} style={{
										...((passwordCheckError&&input.type==='password')?{top: '35%'}:{})
									}}>
										{input.placeholder}{/* placeholder */}
										{input.required?<sup className="white-space-pre">* </sup>:null} {/* * compulsory field marker */}
										<> {/* email and username checker */}
										{formData[input.name] &&
										validateFieldsArr.includes(input.name) && (
											input.name === 'username'?
												(<><span className={`${usernameCheckResponse==='loading'?'d-none':'checkers-style'} ${usernameCheckResponse==='available'?'bg-green':usernameCheckResponse==='not_available'?'bg-red':''}`}>{sentenceCase(usernameCheckResponse)} {checkIcons[usernameCheckResponse]}</span><span className={usernameCheckResponse==='loading'?'':'d-none'}><Spinner type={'dot'}/></span></>):
													input.name === 'email'?
														(<><span className={`${emailCheckResponse==='loading'?'d-none':'checkers-style'} ${emailCheckResponse==='available'?'bg-green':emailCheckResponse==='not_available'?'bg-red':''}`}>{sentenceCase(emailCheckResponse)} {checkIcons[emailCheckResponse]}</span><span className={emailCheckResponse==='loading'?'':'d-none'}><Spinner type={'dot'}/></span></>):
															null
										)}
										</>
									</label>
								</>}
								{/* eye toggler */}
								{(input.name==='password') &&
									<EyeToggler
									ErrStyle={{
										...((passwordCheckError&&input.type==='password')?{top: '35%'}:{})
									}}
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
								{input.type==='password'?<small
								className="password-error">{passwordCheckError}</small>:null}
							</div>
						)
					})}
					<div className="profile-img">
					{/* upload/change images */}
					<ImageCropAndCompress
					onComplete={setUploadedProfileImg}
					// imageId={qIdx}
					imgType="profile" />
					</div>
					{/* <div className="form-group">
						<label htmlFor="email">Email Address</label>
						<input type="email" id="email" name="email" placeholder="Enter your email" required />
					</div>
					<div className="form-group">
						<label htmlFor="subject">Subject</label>
						<input type="text" id="subject" name="subject" placeholder="What's this about?" />
					</div>
					<div className="form-group">
						<label htmlFor="message">Message</label>
						<textarea id="message" name="message" placeholder="Tell us about your project..." required></textarea>
					</div> */}
					<button
					type="submit"
					className="cta-button signup-btn">
						{loading ?
							<Spinner type={'dot'} /> :
							'Register'}</button>
				</form>
			</div>
		</>
	)
}

function EyeToggler({show, passwordToggler, ErrStyle}) {
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

function useEmailAndUsernameChecker() {
	const [availabilityResponse, setAvailabilityResponse] = useState(null);
	const [availabilityLoading, setAvailabilityLoading] = useState(false);
	const [availabilityError, setAvailabilityErrorError] = useState(null);
	const debounceTimer = useRef(null);

	// This is the function you can pass around and call manually
	const checkExistence = useCallback(async (key, value) => {
		return new Promise((resolve) => {

			// debounce setup
			// clears previous timer
			if (debounceTimer.current) clearTimeout(debounceTimer.current);

			// set a new one
			debounceTimer.current = setTimeout(async () => {
				if (!key || !value) {
					resolve({
						availabilityLoading: false,
						availabilityResponse: null,
						availabilityError: null
					});
					return;
				}

				setAvailabilityLoading(true);
				setAvailabilityErrorError(null);
				setAvailabilityResponse(null)

				try {
					const queryString = new URLSearchParams({ [key]: value }).toString();
					const endpoint = `user/check-${key}?${queryString}`;

					console.log({
						queryString,
						endpoint
					})
					const response = await FetchFromServer(endpoint);
					console.log({response})

					setAvailabilityResponse(response?.data);

					resolve({
						availabilityLoading: false,
						availabilityResponse: response?.data,
						availabilityError: null
					});
				} catch (err) {
					setAvailabilityErrorError(err);
					setAvailabilityResponse(null);
					resolve({
						availabilityLoading: false,
						availabilityResponse: null,
						availabilityError: err
					});
				} finally {
					setAvailabilityLoading(false);
				}
			}, 1000);
		})
	}, []);

	return { checkExistence, availabilityResponse, availabilityLoading, availabilityError };
}

export { SignUp };