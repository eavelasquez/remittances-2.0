import "./App.css";
import background from "./assets/img/remittances.jpg";
import Form from "./components/Form";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div
      className="image-container set-full-height"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="container">
        <Form />
      </div>
      <Footer />
    </div>
  );
};

export default App;
