import { useState } from "react";
import "./App.css";

// 단어 변경하고 괄호 삭제까지
const replace = (t) => {
  t = t.replaceAll("하여", "해");
  t = t.replaceAll("하였다", "했다");
  t = t.replaceAll("되어", "돼");
  t = t.replaceAll("되었다", "됐다");
  t = t.replaceAll("하였습니다", "했습니다");
  t = t.replaceAll("되었습니다", "됐습니다");
  t = t.replaceAll("라고", "고");
  t = t.replaceAll("광역시", "시");
  t = t.replaceAll("만 원", "만원");
  t = t.replaceAll("천 원", "천원");
  t = t.replaceAll("억 원", "억원");
  t = t.replaceAll("되었으며", "됐으며");
  t = t.replaceAll("하였으며", "했으며");
  t = t.replaceAll("전했다", "밝혔다");
  t = t.replaceAll("라면서", "라며");
  t = t.replaceAll("라고", "고");
  t = t.replaceAll("구청장", "청장");
  t = t.replaceAll("특히,", "특히");
  t = t.replaceAll("또,", "또");
  t = t.replaceAll("또한,", "또한");
  t = t.replaceAll("다음달", "내달");
  t = t.replaceAll("△", "▲");
  // 괄호 삭제
  t = t.replace(/\([^)]*\)/g, "");
  // 숫자에 , 빼기
  t = t.replace(/(?<=\d),(?=\d)/g, "");
  return t;
};

// 구 이름 떼기
const guRemove = (t) => {
  const keywords = [
    "대전 서구",
    "대전 유성구",
    "대전 동구",
    "대전 대덕구",
    "대전 중구",
  ];
  keywords.forEach((keyword) => {
    const tk = keyword.split(" ")[1];
    const ta = t.indexOf(keyword);
    if (ta >= 0) {
      let tempt = t.substr(ta + keyword.length).replaceAll(keyword, tk);
      tempt = tempt.replaceAll(tk + " ", "구 ");
      t = t.substr(0, ta + keyword.length) + tempt;
    }
  });
  return t;
};
const numToKor = (t) => {
  let ta = t.match(/\d{13,}/g);
  ta &&
    ta.forEach((te) => {
      let temp = Math.floor(Number(te) / 10 ** 12);
      let ce = temp + "조" + te.substr(-12);
      t = t.replaceAll(te, ce);
    });

  ta = t.match(/\d{9,}/g);
  ta &&
    ta.forEach((te) => {
      let temp = Math.floor(Number(te) / 10 ** 8);
      let ce = (temp !== 0 ? temp + "억" : "") + te.substr(-8);
      t = t.replaceAll(te, ce);
    });

  ta = t.match(/\d{5,}/g);
  ta &&
    ta.forEach((te) => {
      let temp = Math.floor(Number(te) / 10 ** 4);
      let ce =
        (temp !== 0 ? temp + "만" : "") +
        (Number(te.substr(-4)) !== 0 ? Number(te.substr(-4)) : "");
      t = t.replaceAll(te, ce);
    });

  return t;
};
// 이달 내달
const changeNextMonthKorVer = (t) => {
  const this_month = Number(new Date().getMonth() + 1);
  const next_month = this_month === 12 ? 1 : this_month + 1;
  t = t.replaceAll(this_month + "월", "이달");
  t = t.replaceAll(next_month + "월", "내달");
  return t;
};

// 전체적으로 실행.
const transform = (inputText) => {
  let result = "[충청신문=대전] 윤지현 기자 = " + inputText;
  result = replace(result);
  result = guRemove(result);
  result = changeNextMonthKorVer(result);
  result = numToKor(result);
  return result;
};

function App() {
  const [inputText, setInputText] = useState();
  const [result, setResult] = useState();
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  const handleResultChange = (e) => {
    setResult(e.target.value);
  };

  const handleSubmit = () => {
    setResult(transform(inputText));
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
              onInput={handleInputChange}
              style={{ resize: "none" }}
            />
          </div>
          <textarea
            rows={40}
            cols={70}
            placeholder="여기 결과 나옴"
            value={result}
            onInput={handleResultChange}
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
