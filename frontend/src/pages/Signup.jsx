import {useState} from "react";
import API from "../services/api";
import {useNavigate,Link} from "react-router-dom";
import "./Login.css";


export default function Signup(){


const [name,setName]=useState("");

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [confirmPassword,setConfirmPassword]=useState("");

const [error,setError]=useState("");

const [success,setSuccess]=useState("");

const [loading,setLoading]=useState(false);

const navigate=useNavigate();



async function submit(e){

e.preventDefault();

setError("");
setSuccess("");

if(password!==confirmPassword)
{
setError("Passwords do not match");
return;
}

setLoading(true);


try{

await API.post(
"/auth/signup",
{
name,
email,
password
}
);


setSuccess("Signup successful. Redirecting to login...");

setTimeout(()=>{
navigate("/login");
},1200);


}
catch(err){

setError(
err.response?.data?.message ||
"Signup failed. Please try again."
);

}
finally{

setLoading(false);

}


}



return(

<div className="auth-page">

<div className="auth-tricolour" aria-hidden="true">
<span></span>
<span></span>
<span></span>
</div>

<a href="#auth-main" className="auth-skip-link">Skip to main content</a>

<div className="auth-credential-bar">
<span>Government of Kerala Undertaking</span>
<span className="auth-credential-ref">File No. KMRL/IT/DMS/2026</span>
</div>

<main id="auth-main" className="auth-main">

<div className="auth-card">

<Link to="/" className="auth-back">
← Back to home
</Link>

<div className="auth-letterhead">

<Seal size={38} />

<div className="auth-letterhead-text">
<strong>KMRL</strong>
<span>Document Management System</span>
</div>

</div>

<p className="auth-eyebrow">Staff Registration</p>

<h1 className="auth-title">Create your account</h1>

<p className="auth-subtitle">
Sign up for the KMRL Smart Document Management System.
Manager and admin accounts are provisioned separately and cannot be
created here.
</p>


<form onSubmit={submit} className="auth-form">


{error && (
<div className="auth-error">
{error}
</div>
)}


{success && (
<div className="auth-success">
{success}
</div>
)}


<label className="auth-label">
Full name

<input
className="auth-input"
type="text"
placeholder="Your full name"
value={name}
required
onChange={e=>setName(e.target.value)}
/>
</label>


<label className="auth-label">
Email

<input
className="auth-input"
type="email"
placeholder="you@kmrl.co.in"
value={email}
required
onChange={e=>setEmail(e.target.value)}
/>
</label>


<label className="auth-label">
Password

<input
className="auth-input"
type="password"
placeholder="••••••••"
value={password}
required
minLength={6}
onChange={e=>setPassword(e.target.value)}
/>
</label>


<label className="auth-label">
Confirm password

<input
className="auth-input"
type="password"
placeholder="••••••••"
value={confirmPassword}
required
minLength={6}
onChange={e=>setConfirmPassword(e.target.value)}
/>
</label>


<button
className="auth-button"
disabled={loading}
>
{loading ? "Creating account..." : "Sign up"}
</button>


</form>

<p className="auth-footnote">
Already have an account? <Link to="/login">Login here</Link>
</p>

</div>

</main>

</div>

)

}



function Seal({ size = 40 }) {

  const stroke = "#0B2545";
  const fill = "#F7F4EE";

  return (

    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >

      <circle cx="32" cy="32" r="30" stroke={stroke} strokeWidth="2" />
      <circle cx="32" cy="32" r="24" stroke={stroke} strokeWidth="1" />

      {/* stylised rail arc */}
      <path
        d="M14 36 A18 18 0 0 1 50 36"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      <circle cx="14" cy="36" r="2.5" fill={stroke} />
      <circle cx="32" cy="20.5" r="2.5" fill={stroke} />
      <circle cx="50" cy="36" r="2.5" fill={stroke} />

      {/* document glyph */}
      <rect x="26" y="38" width="12" height="15" rx="1.5" stroke={stroke} strokeWidth="2" fill={fill} />
      <line x1="29" y1="43" x2="35" y2="43" stroke={stroke} strokeWidth="1.4" />
      <line x1="29" y1="47" x2="35" y2="47" stroke={stroke} strokeWidth="1.4" />

    </svg>

  );

}