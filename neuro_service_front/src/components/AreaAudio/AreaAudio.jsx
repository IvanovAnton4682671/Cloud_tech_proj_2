import React from "react";
import axios from "axios";
import styles from "./AreaAudio.module.css";

function AreaAudio({ messages, updateMessages }) {
  //состояние для отлова загружаемого аудиофайла
  const [selectedFile, setSelectedFile] = React.useState(null);

  //статус работы сервера
  const [sending, setSending] = React.useState(false);

  //ссылка на messageBox для прокрутки вниз
  const messageBoxRef = React.useRef(null);

  //отлов загружаемого аудиофайла
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  //обработка запроса при отправке сообщения
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      updateMessages({ type: "response", text: "Пожалуйста, выберите файл." });
      return;
    }

    const formData = new FormData();
    formData.append("audio", selectedFile);
    updateMessages({ type: "user", text: "*файл загружен*" });

    try {
      setSending(true);
      const response = await axios.post(
        "http://localhost:8000/user_message_audio",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      updateMessages({ type: "response", text: response.data.response });
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      updateMessages({
        type: "response",
        text: "Ошибка соединения с сервером.",
      });
    } finally {
      setSending(false);
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
        <h4>Загрузите аудиофайл</h4>
      ) : (
        <h4>Выполняется распознавание аудиофайла. Пожалуйста, подождите...</h4>
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
              {message.text}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.inputZone}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="upload">Выбрать файл</label>
          <input
            id="upload"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
          ></input>
          <button type="submit">Отправить</button>
        </form>
      </div>
    </div>
  );
}

export default AreaAudio;
