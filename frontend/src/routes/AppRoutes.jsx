import {
Routes,
Route
} from "react-router-dom";


import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Admin from "../pages/Admin";
import Manager from "../pages/Manager";
import Employee from "../pages/Employee";


export default function AppRoutes(){


return(

<Routes>


<Route
path="/"
element={<Landing/>}
/>


<Route
path="/login"
element={<Login/>}
/>


<Route
path="/signup"
element={<Signup/>}
/>


<Route
path="/admin"
element={<Admin/>}
/>


<Route
path="/manager"
element={<Manager/>}
/>


<Route
path="/employee"
element={<Employee/>}
/>


</Routes>

)


}