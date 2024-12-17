import React from "react";
import SideMenu from "../SideMenu/SideMenu";
import AreaText from "../AreaText/AreaText";
import AreaImg from "../AreaImg/AreaImg";
import AreaAudio from "../AreaAudio/AreaAudio";
import styles from "./Body.module.css";

function Body() {
  //состояние для отображения нужной нейросети
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  //хранилище чатов для всех компонентов
  const [chatHistories, setChatHistories] = React.useState({
    textChat: [],
    imgChat: [],
    audioChat: [],
  });

  //ключи для sessionStorage
  const STORAGE_KEYS = {
    textChat: "textChatMessages",
    imgChat: "imgChatMessages",
    audioChat: "audioChatMessages",
  };

  //загрузка данных из sessionStorage при монтировании
  React.useEffect(() => {
    const textChat =
      JSON.parse(sessionStorage.getItem(STORAGE_KEYS.textChat)) || [];
    const imgChat =
      JSON.parse(sessionStorage.getItem(STORAGE_KEYS.imgChat)) || [];
    const audioChat =
      JSON.parse(sessionStorage.getItem(STORAGE_KEYS.audioChat)) || [];
    setChatHistories({ textChat, imgChat, audioChat });
  }, []);

  const updateChat = (chatType, newMessage) => {
    setChatHistories((prevChatHistories) => ({
      ...prevChatHistories,
      [chatType]: [...prevChatHistories[chatType], newMessage],
    }));
  };

  //рендер нужной нейросети при нажатии на объект меню
  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <AreaText
            messages={chatHistories.textChat}
            updateMessages={(msgs) => updateChat("textChat", msgs)}
          />
        );
      case 1:
        return (
          <AreaImg
            messages={chatHistories.imgChat}
            updateMessages={(msgs) => {
              updateChat("imgChat", msgs);
            }}
          />
        );
      case 2:
        return (
          <AreaAudio
            messages={chatHistories.audioChat}
            updateMessages={(msgs) => updateChat("audioChat", msgs)}
          />
        );
      default:
        return <h1>Выберите нужную нейросеть</h1>;
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.sideMenu}>
        <SideMenu onSelect={(index) => setSelectedIndex(index)}></SideMenu>
      </div>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
}

export default Body;
