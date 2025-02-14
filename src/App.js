import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';
import ApiRoutes from './routes/ApiRoutes';

function App() {
  return (
    <BrowserRouter>
    <Toaster position='top-right' />
    <ApiRoutes/>
    </BrowserRouter>
  );
}

export default App;
