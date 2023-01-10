import './App.css';
import AddPlant from './components/AddPlant';
import ModifyPlant from './components/ModifyPlant';
import {Plants} from "./components/Plants";
import AddCategory from "./components/AddCategory"
import { Categories } from './components/Categories';
import { useEffect, useState } from 'react';
import { useLocalState } from './util/UseLocalStorage';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import Homepage from './components/Homepage';
import Register from './components/Register';
import PlantView from './components/PlantView';
import AdminPanel from './components/AdminPanel';

function App() {

  const [jwt, setJwt] = useLocalState("", "jwt");

  return (
    <Routes>
      <Route path="dashboard" element={ 
        <PrivateRoute>
          <Dashboard/> 
        </PrivateRoute>
      }/>
      <Route path="adminPanel" element={ 
        <PrivateRoute>
          <AdminPanel/> 
        </PrivateRoute>
      }/>
      <Route path="/addPlant" element={
        <PrivateRoute>
          <AddPlant/>
        </PrivateRoute>
      }/>
      <Route path="/modifyPlant/:id" element={
        <PrivateRoute>
          <ModifyPlant/>
        </PrivateRoute>
      }/>
      <Route path="/addCategory" element={
        <PrivateRoute>
          <AddCategory/>
        </PrivateRoute>
      }/>
      <Route path="login" element={ <Login/> }/>
      <Route path="/plant/:id" element={<PlantView/>}/>
      <Route path="register" element={ <Register/> }/>
      <Route path="/" element={<Homepage/>}/>
    </Routes>
  );
}

export default App;
