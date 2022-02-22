import * as React from "react";
import { Room } from "@material-ui/icons";
import "./register.scss";

interface IRegisterProps {}

const Register: React.FunctionComponent<IRegisterProps> = (props) => {
  return (
    <div className="register-container">
      <div className="logo">
        <Room></Room>
        JewooDev.Map
      </div>
      <form action="">
        <div className="username-wrap">
          <label htmlFor="username">Username</label>
          <input type="text" placeholder="username" id="username" />
        </div>
        <div className="email-wrap">
          <label htmlFor="email">Email</label>
          <input type="email" placeholder="email" id="email" />
        </div>
        <div className="password-wrap">
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="password" id="password" />
        </div>
        <div className="button-wrap">
          <button>Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
