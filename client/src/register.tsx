import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Component() {
  const [email, setEmail] = React.useState();
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();
  const [repassword, setRePassword] = React.useState();

  let navigate = useNavigate();

  async function login() {
    try {
      await axios.post("http://localhost:3000/register", {
        email,
        username,
        password,
        repassword,
      });

      navigate('/')
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <form className="flex max-w-md flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email1"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(event: any) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Your Username" />
          </div>
          <TextInput
            id="username"
            type="username"
            placeholder="Username"
            required
            value={username}
            onChange={(event: any) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="type Password" />
          </div>
          <TextInput
            id="password1"
            type="password"
            placeholder="type Password"
            required
            value={password}
            onChange={(event: any) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password2" value="retype password" />
          </div>
          <TextInput
            id="password2"
            type="password"
            placeholder="Retype Password"
            required
            value={repassword}
            onChange={(event: any) => setRePassword(event.target.value)}
          />
        </div>
        <Button onClick={login} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
