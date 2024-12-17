import React from "react";
import axios from "axios";
import styles from "./EntranceForm.module.css";

function EntranceForm({ onAuthorize }) {
  //отлов смены формы
  const [isChanged, setIsChanged] = React.useState(false);

  //хранение почты пользователя
  const [email, setEmail] = React.useState("");

  //хранение пароля пользователя
  const [password, setPassword] = React.useState("");

  //отправка формы авторизации
  const handleSubmitAuth = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Не оставляйте поля формы пустыми!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/authorization", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        onAuthorize();
      } else if (response.status === 201) {
        alert("Пользователя с такими данными не существует!");
        return;
      }
    } catch (error) {
      console.error("Ошибка сети при авторизации: ", error);
    }
  };

  //отправка формы регистрации
  const handleSubmitReg = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Не оставляйте поля формы пустыми!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/registration", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        onAuthorize();
      } else if (response.status === 201) {
        alert("Пользователь с такими данными уже существует!");
        return;
      }
    } catch (error) {
      console.error("Ошибка сети при регистрации: ", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainForm}>
        {isChanged === false ? (
          <form onSubmit={handleSubmitAuth}>
            <h4>Авторизация</h4>
            <input
              type="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button type="submit">Авторизоваться</button>
            <button type="button" onClick={() => setIsChanged(true)}>
              Зарегистрироваться
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitReg}>
            <h4>Регистрация</h4>
            <input
              type="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button type="submit">Зарегистрироваться</button>
            <button type="button" onClick={() => setIsChanged(false)}>
              Авторизоваться
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EntranceForm;
