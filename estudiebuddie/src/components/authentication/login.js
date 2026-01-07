import { useState, useEffect } from "react";
import { FetchFromServer } from "../../hooks/FetchFromServer";
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/authContext";
import { Spinner, SpinnerBarForPage } from "../../hooks/spinner/spinner";

const formValues = {
	email: "",
	password: "",
}
const formHead = [
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
		name: "password",
		required: true,
		disabled: false,
		type: "password",
		placeholder: "Password",
		width: "70%",
		case: null,
	},
]

function Login() {
	const [loadingPage, setLoadingPage] = useState(true);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate()
	const { loggedIn, setLoggedIn } = useAuth()
	const [formData, setFormData] = useState(formValues);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	};
	useEffect(() => {
		setLoadingPage(false)
	}, []);

	const submitHandler = async (e) => {
		e.preventDefault(); // prevent default page refresh
		setLoading(true)
		// const cleanedData = {...formData}
		const cleanedData = structuredClone(formData);
		console.log({formData})

		const endpoint = 'api/token'
		const res = await FetchFromServer(endpoint, 'POST', cleanedData, true)
		console.log(
			'Form submitted with data:',
			{
				cleanedData,
				res,
			});
		if (res.ok) {
			toast.success('Success')
			setLoggedIn(res.ok)
			setLoadingPage(true)
			navigate(-1)
		}
		setLoading(false)
		setLoadingPage(false)
	};

	console.log({
		formData,
	})
	return (
		<>
			{/* spinner */}
			{loadingPage && <SpinnerBarForPage />}

			<div className={`login-form glass flex-column ${loadingPage?'d-none':''}`}>
				<h1>Login</h1>
				<form onSubmit={submitHandler}
				className="form-column">
					{formHead.map((input, inpIdx) => {
						console.log({
							field: input.name,
							value: formData[input.name]
						})
						return (
							<div key={input.name+inpIdx}
							// style={{width: input.width}}
							className={`form-group floating-field mb-0 ${input.type==='password'?'form-password':''}`}>
								<>
									<input
									className="text-center"
									value={formData[input.name]}
									onChange={handleChange}
									type={(input.type==='password'&&showPassword)?'text':input.type}
									id={input.name}
									name={input.name}
									placeholder=" "
									required={input.required}
									disabled={input.disabled}
									/>
									<label>{input.placeholder}{input.required?<sup>*</sup>:null}</label>
								</>
								{(input.type==='password') && (
									<span
									role="button"
									onClick={() => setShowPassword(prev => !prev)}
									className="eye"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											setShowPassword(prev => !prev);
										}
									}}
									>
									<FontAwesomeIcon
										icon={showPassword ? "eye-slash" : "eye"}
									/>
									</span>
								)}
							</div>
						)
					})}
					<button
					type="submit"
					className="cta-button">
						{loading ?
							<Spinner type={'dot'} /> :
							'Login'}
					</button>
				</form>
				<p className="forgot-password-new-user">Forgot Password? <Link className="">click here</Link></p>
				<p className="forgot-password-new-user">New User? <Link to={'/signup'} className="">Register</Link></p>
			</div>
		</>
	)
}
export { Login };