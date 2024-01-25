import { useState } from "react";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState();
  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = () => {
    console.log(inputText);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div>
            <textarea
              rows={40}
              cols={70}
              placeholder="글 입력하기.."
              onInput={handleChange}
              style={{ resize: "none" }}
            />
          </div>
          <textarea
            rows={40}
            cols={70}
            placeholder="여기 결과 나옴"
            value={inputText}
            readOnly={true}
            style={{ resize: "none" }}
          />
        </div>
        <button
          style={{ width: "100px", height: "5 0px", fontSize: "20px" }}
          onClick={handleSubmit}
        >
          변환하기
        </button>
      </header>
    </div>
  );
}

export default App;
