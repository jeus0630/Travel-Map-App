import * as React from "react";
import { useState, useRef } from "react";
import { Cancel, Room } from "@material-ui/icons";
import { ActionType } from "../react-app-env";

import "./register.scss";

interface IRegisterProps {
  dispatch: React.Dispatch<ActionType>;
}

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

const Register: React.FunctionComponent<IRegisterProps> = ({ dispatch }) => {
  const [info, setInfo] = useState<InfoType>({
    username: "",
    email: "",
    password: "",
  });

  const [username, setUsername] = useState(true);
  const [email, setEmail] = useState(true);
  const [password, setPassword] = useState(true);
  const [register, setRegister] = useState(false);

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

      if (res.status !== 200) {
        setInvalidUser(true);
        userInput.current.focus();
        return;
      }

      const data = await res.json();
      setInvalidUser(false);
      setRegister(true);
      setInfo({
        ...info,
        username: "",
        email: "",
        password: ""
      })
    } catch (err) {
      console.log(err);
    }
  };

  const logInClickHandler = () => {
    dispatch({ type: 'showRegister', payload: false });
    dispatch({ type: 'showLogin', payload: true });
  }

  const cancelHandler = () => {
    dispatch({ type: "showRegister", payload: false });
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
        {
          register && (<div className="success-wrap">
            <p>
              You have successfully registerd. Log in <span onClick={logInClickHandler}>Here</span>
            </p>
          </div>)
        }
        <div className="button-wrap">
          <button onClick={registerHandler}>Register</button>
        </div>
      </form>
      <Cancel className="register-cancel" onClick={cancelHandler}></Cancel>
    </div>
  );
};

export default Register;
