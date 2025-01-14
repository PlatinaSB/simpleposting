import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { setAuthToken } from "./App";
import { useNavigate } from "react-router-dom";

export default function LoginComponent() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  let navigate = useNavigate();

  async function login() {
    try {
      const res = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userid", res.data.userid);

      setAuthToken(res.data.token);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="flex max-w-md flex-col gap-4" onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Your Username" />
          </div>
          <TextInput
            id="username"
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Your Password" />
          </div>
          <TextInput
            id="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button onClick={login} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
