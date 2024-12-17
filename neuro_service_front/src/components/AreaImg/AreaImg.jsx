import React from "react";
import axios from "axios";
import styles from "./AreaImg.module.css";

function AreaImg({ messages, updateMessages }) {
  //текущий отправленный текст
  const [inputText, setInputText] = React.useState("");

  //статус работы сервера
  const [sending, setSending] = React.useState(false);

  //ссылка на messageBox для прокрутки вниз
  const messageBoxRef = React.useRef(null);

  //обработка запроса при отправке сообщения
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() !== "") {
      updateMessages({ type: "user", text: inputText });

      setInputText("");

      try {
        setSending(true);
        const response = await axios.post(
          "http://localhost:8000/user_message_img",
          {
            message: inputText,
          }
        );
        updateMessages({ type: "response", img: response.data.response });
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
        updateMessages({
          type: "response",
          text: "Ошибка соединения с сервером.",
        });
      } finally {
        setSending(false);
      }
    }
  };

  //прокрутка messageBox вниз
  React.useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.wrapper}>
      {sending === false ? (
        <h4>On English, please (наш индус знает только Английский)</h4>
      ) : (
        <h4>Выполняется генерация изображения. Пожалуйста, подождите...</h4>
      )}
      <div className={styles.mainArea}>
        <div className={styles.messageBox} ref={messageBoxRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.type === "user"
                  ? styles.yourMessage
                  : styles.responseMessage
              }
            >
              {message.type === "user" ? (
                message.text
              ) : message.img ? (
                <img
                  src={`data:image/png;base64,${message.img}`}
                  alt="Generated"
                  className={styles.generatedImage}
                />
              ) : (
                message.text
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.inputZone}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Напишите что-нибудь"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></input>
          <button type="submit">Отправить</button>
        </form>
      </div>
    </div>
  );
}

export default AreaImg;
