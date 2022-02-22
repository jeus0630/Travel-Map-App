import * as React from "react";
import { useState, useRef } from "react";
import { Room } from "@material-ui/icons";
import "./register.scss";

interface IRegisterProps {}

type InfoType = {
  [key: string]: string;
  username: string;
  email: string;
  password: string;
};

type IntputHandlerType = {
  [key: string]: (bool: boolean) => void;
  username: (bool: boolean) => void;
  email: (bool: boolean) => void;
  password: (bool: boolean) => void;
};

const Register: React.FunctionComponent<IRegisterProps> = (props) => {
  const [info, setInfo] = useState<InfoType>({
    username: "",
    email: "",
    password: "",
  });

  const [username, setUsername] = useState(true);
  const [email, setEmail] = useState(true);
  const [password, setPassword] = useState(true);

  const [invalidUser, setInvalidUser] = useState(false);
  const userInput = useRef<HTMLInputElement>(null!);
  const inputHandler: IntputHandlerType = {
    username: (bool) => {
      setUsername(bool);
    },
    email: (bool) => {
      setEmail(bool);
    },
    password: (bool) => {
      setPassword(bool);
    },
  };

  const changeHandler = (e: React.ChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement;

    setInfo({
      ...info,
      [name]: value,
    });

    if (value) inputHandler[name](true);
    else inputHandler[name](false);
  };

  const registerHandler = async (e: React.MouseEvent) => {
    e.preventDefault();

    let isAllTrue = true;
    for (let key in info) {
      if (!info[key]) {
        isAllTrue = false;
        inputHandler[key](false);
      }
    }

    if (!isAllTrue) return;

    try {
      const res = await fetch("/users/register", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      if (!data.status?.username) {
        setInvalidUser(true);
        userInput.current.focus();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="register-container">
      <div className="logo">
        <Room></Room>
        JewooDev.Map
      </div>
      <form action="">
        <div className="username-wrap">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="username"
            id="username"
            value={info.username}
            name="username"
            onChange={changeHandler}
            ref={userInput}
          />
          {invalidUser && (
            <span className="warning warning-invalid-username">
              Invalid Username
            </span>
          )}

          {!username && (
            <span className="warning warning-username">Enter a username</span>
          )}
        </div>
        <div className="email-wrap">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="email"
            id="email"
            value={info.email}
            name="email"
            onChange={changeHandler}
          />
          {!email && (
            <span className="warning warning-email">Enter an email</span>
          )}
        </div>
        <div className="password-wrap">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="password"
            id="password"
            value={info.password}
            name="password"
            onChange={changeHandler}
          />
          {!password && (
            <span className="warning warning-password">Enter a password</span>
          )}
        </div>
        <div className="button-wrap">
          <button onClick={registerHandler}>Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
