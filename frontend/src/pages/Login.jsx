import {useState,useContext} from "react";
import API from "../services/api";
import {AuthContext} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";


export default function Login(){


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const {login}=useContext(AuthContext);

const navigate=useNavigate();



async function submit(e){

e.preventDefault();


const res=await API.post(
"/auth/login",
{
email,
password
}
);


login(res.data);


if(res.data.role==="ADMIN")
navigate("/admin");

else if(res.data.role==="MANAGER")
navigate("/manager");

else
navigate("/employee");


}



return(

<form onSubmit={submit}>


<input
placeholder="Email"
onChange={e=>setEmail(e.target.value)}
/>


<input
type="password"
placeholder="Password"
onChange={e=>setPassword(e.target.value)}
/>


<button>
Login
</button>


</form>

)

}