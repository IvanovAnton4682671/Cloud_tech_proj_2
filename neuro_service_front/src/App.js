import React from "react";
import EntranceForm from "./components/EntranceForm/EntranceForm";
import YandexCaptcha from "./components/YandexCaptcha/YandexCaptcha";
import Body from "./components/Body/Body";

function App() {
  //состояние авторизованности пользователя
  const [authorized, setAuthorized] = React.useState(false);

  //состояние прохождения капчи
  const [captchaPassed, setCaptchaPassed] = React.useState(false);

  //пользователь вошёл в систему
  const handleAuthorize = () => {
    setAuthorized(true);
  };

  //пользователь успешно прошел капчу
  const handleCaptchaSuccess = (token) => {
    console.log("Капча успешно пройдена, токен:", token);
    setCaptchaPassed(true);
  };

  //этап капчи
  if (!captchaPassed) {
    return <YandexCaptcha onSuccess={handleCaptchaSuccess} />;
  }

  return authorized === false ? (
    <EntranceForm onAuthorize={handleAuthorize} />
  ) : (
    <Body />
  );
}

export default App;
