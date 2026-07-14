import {createContext,useState} from "react";


export const AuthContext=createContext();


function loadUser(){

const raw=localStorage.getItem("user");

if(!raw) return null;

try{
return JSON.parse(raw);
}
catch(error){
return null;
}

}


export function AuthProvider({children}){


const [user,setUser]=useState(loadUser());


// login accepts the raw backend response: { message, user: {id,name,email,role}, token? }

function login(data){

const userData=data.user || data;

localStorage.setItem(
"token",
data.token || ""
);


localStorage.setItem(
"user",
JSON.stringify(userData)
);


setUser(userData);

}



function logout(){

localStorage.clear();
setUser(null);

}



return(

<AuthContext.Provider
value={{
user,
role:user?.role || null,
login,
logout
}}
>

{children}

</AuthContext.Provider>

)

}