import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdPerson,
  MdHome,
  MdLocationCity,
  MdReport,
  MdAssessment
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import Profile from 'views/admin/profile';
import Login from './views/admin/auth/login';
import Complex from 'views/admin/complexes';
import AuthIllustration from "layouts/auth/Default";
import Incidence from "views/admin/incidence/index";
import Administration from "views/admin/administration";
import Reports from 'views/admin/Report';
import Notfound from 'views/admin/notfound/notfound'; // Import Notfound component
import "views/admin/notfound/style.css"; // Import Notfound CSS file
import { Navigate } from 'react-router-dom';

// Auth Imports
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/admin/default" /> : children;
};

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Reports',
    layout: '/admin',
    path: '/report',
    icon: <Icon as={MdAssessment} width="20px" height="20px" color="inherit" />,
    component: <Reports />,
  },
  {
    name: 'Complexes',
    layout: '/admin',
    path: '/complexes',
    icon: <Icon as={MdLocationCity} width="20px" height="20px" color="inherit" />,
    component: <Complex />,
  },
  {
    name: 'My Profile',
    layout: '/admin',
    path: '/my-profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Incidence',
    layout: '/admin',
    path: '/tickets',
    icon: <Icon as={MdReport} width="20px" height="20px" color="inherit" />,
    component: <Incidence />,
  },
  {
    name: 'Administration',
    layout: '/admin',
    path: '/administration',
    icon: <Icon as={MdReport} width="20px" height="20px" color="inherit" />,
    component: <Administration />,
  },
  {
    path: "/login",
    layout: "/auth",
    component: <PublicRoute><AuthIllustration ><Login /></AuthIllustration></PublicRoute>
  },

  {
    path: "*",
    layout: "/admin",
    component: <Notfound />
  }
];

export default routes;
