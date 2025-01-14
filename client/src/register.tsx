import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Component() {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [repassword, setRePassword] = React.useState("");

  let navigate = useNavigate();

  async function register() {
    try {
      await axios.post("http://localhost:3000/register", {
        email,
        username,
        password,
        repassword,
      });

      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="flex max-w-md flex-col gap-4" onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
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
            <Label htmlFor="password" value="Type Password" />
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
        <div>
          <div className="mb-2 block">
            <Label htmlFor="repassword" value="Retype Password" />
          </div>
          <TextInput
            id="repassword"
            type="password"
            placeholder="Retype Password"
            required
            value={repassword}
            onChange={(event) => setRePassword(event.target.value)}
          />
        </div>
        <Button onClick={register} type="submit">
          Register
        </Button>
      </form>
    </div>
  );
}
