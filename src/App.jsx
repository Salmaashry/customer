import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar/Navbar';
import TableData from './components/TableData/TableData';
import Footer from './components/Footer/Footer';




function App() {
  return (
    <div className="App">
     <Navbar />
    <TableData/>

         
    <Footer />
      </div>
     
   
  );
}


export default App;