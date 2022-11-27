import './App.css';
import { AddPlant } from './components/AddPlant';
import {Plants} from "./components/Plants";
import {AddCategory} from "./components/AddCategory"
import { Categories } from './components/Categories';

function App() {
  return (
    <div className="App">
      <AddPlant/>
      <AddCategory/>
      <Plants/>
      <Categories/>
    </div>
  );
}

export default App;
