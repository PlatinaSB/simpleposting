import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { setAuthToken } from "./App";
import { useNavigate } from "react-router-dom";


export default function Component() {
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();
  let navigate = useNavigate();

  async function login() {
    try {
      const res = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <form className="flex max-w-md flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your Username" />
          </div>
          <TextInput
            id="email1"
            type="email"
            placeholder="Username"
            required
            value={username}
            onChange={(event: any) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput
            id="password1"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(event: any) => setPassword(event.target.value)}
          />
        </div>
        <Button onClick={login} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
