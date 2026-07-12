import {createContext,useState} from "react";


export const AuthContext=createContext();


export function AuthProvider({children}){


const [role,setRole]=useState(
localStorage.getItem("role")
);



function login(data){

localStorage.setItem(
"token",
data.token
);


localStorage.setItem(
"role",
data.role
);


setRole(data.role);

}



function logout(){

localStorage.clear();
setRole(null);

}



return(

<AuthContext.Provider
value={{
role,
login,
logout
}}
>

{children}

</AuthContext.Provider>

)

}