import { Cancel, Room } from "@material-ui/icons";
import * as React from "react";
import { useState } from "react";
import { ActionType } from "../react-app-env";
import './Login.scss';

interface ILoginProps {
  dispatch: React.Dispatch<ActionType>;
}

type InfoType = {
  username: string;
  password: string;
}

type changeStateType = {
  [key: string]: (bool: boolean) => void;
  username: (bool: boolean) => void;
  password: (bool: boolean) => void;
}

const Login: React.FunctionComponent<ILoginProps> = ({ dispatch }) => {
  const [info, setInfo] = useState<InfoType>({
    username: '',
    password: ''
  })

  const changeState: changeStateType = {
    username: (bool) => {
      setUsername(bool);
    },
    password: (bool) => {
      setPassword(bool);
    }
  }

  const [username, setUsername] = useState(true);
  const [password, setPassword] = useState(true);
  const [msg, setMsg] = useState(false);
  const changeHandler = (e: React.ChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement;

    setInfo({
      ...info,
      [name]: value
    })

    if (value) {
      changeState[name](true);
    } else {
      changeState[name](false);
    }

  }

  const cancelHandler = () => {
    dispatch({ type: 'showLogin', payload: false });
  }

  const loginHandler = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!info.username) setUsername(false);
    if (!info.password) setPassword(false);

    if (!username || !password) return;

    try {
      const res = await fetch('/users/login', {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });

      if (res.status !== 200) {
        setMsg(true);
        return;
      }

      const data = await res.json();

      window.localStorage.setItem("user", data.username);
      dispatch({ type: 'user', payload: data.username });
      dispatch({ type: 'showLogin', payload: false });

    } catch (err) {
      console.log(err);
    }

  }

  return (
    <div className="login-container">
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
            autoComplete="off"
          />
          {!username && (
            <span className="warning warning-username">Enter a username</span>
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
          msg && (<div className="msg-wrap">
            <span className="warning warning-invalid-user">Invalid Username or Password</span>
          </div>)
        }

        <div className="button-wrap">
          <button onClick={loginHandler}>Login</button>
        </div>
      </form>
      <Cancel className="login-cancel" onClick={cancelHandler}></Cancel>
    </div>
  );
};

export default Login;