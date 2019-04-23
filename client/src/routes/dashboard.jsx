import Dashboard from "views/Dashboard/Dashboard.jsx";

import Typography from "views/Typography/Typography.jsx";
import TableList from "views/TableList/TableList.jsx";

import UserPage from "views/UserPage/UserPage.jsx";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard
  },
  {
    path: "/transfer",
    name: "Transfer",
    icon: "nc-icon nc-caps-small",
    component: Typography
  },
  
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: UserPage
  },
  {
    path: "/tables",
    name: "Table List",
    icon: "nc-icon nc-tile-56",
    component: TableList
  },

 
  { redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard" }
];
export default dashRoutes;
