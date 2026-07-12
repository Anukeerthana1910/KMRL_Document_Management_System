import {
Routes,
Route
} from "react-router-dom";


import Login from "../pages/Login";
import Admin from "../pages/Admin";
import Manager from "../pages/Manager";
import Employee from "../pages/Employee";


export default function AppRoutes(){


return(

<Routes>


<Route 
path="/"
element={<Login/>}
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