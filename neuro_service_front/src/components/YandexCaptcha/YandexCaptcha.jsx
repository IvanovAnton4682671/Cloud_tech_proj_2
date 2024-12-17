import React, { useEffect, useRef } from "react";

const YandexCaptcha = ({ onSuccess }) => {
  const captchaRef = useRef(null);

  useEffect(() => {
    const onLoad = () => {
      if (window.smartCaptcha) {
        window.smartCaptcha.render("captcha-container", {
          sitekey: "ysc1_z5bQN6GxptBIDoEGjlAPyWX7D182MsnimjNuZbco79475297",
          callback: (token) => {
            console.log("Капча пройдена, токен:", token);
            onSuccess(token); // Передаем успешное событие наверх
          },
          error_callback: (err) => {
            console.error("Ошибка капчи:", err);
          },
        });
      }
    };

    if (window.smartCaptcha) {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, [onSuccess]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h3>Пожалуйста, пройдите проверку</h3>
      <div
        id="captcha-container"
        ref={captchaRef}
        style={{ height: "100px", width: "500px" }}
      ></div>
    </div>
  );
};

export default YandexCaptcha;
