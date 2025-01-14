import { Button, Label, Modal, TextInput } from "flowbite-react";
import { setAuthToken } from "./App";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function component() {
  const [openModalemail, setOpenModalemail] = useState(false);
  const [openModalpasss, setOpenModalpass] = useState(true);

  const [email, setEmail] = useState("");
  const [oldpassword, setoldpassword] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");

  function onCloseModalpassword() {
    setOpenModalpass(false);
    setRePassword("");
    setPassword("");
    setoldpassword("");
  }

  function onCloseModalemail() {
    setOpenModalemail(false);
    setEmail("");
  }

  async function changePassword(
    oldpassword: string,
    password: string,
    repassword: string,
  ) {
    try {
      const res = await axios.put("http://localhost:3000/changepassword", {
        oldpassword,
        password,
        repassword,
      });
      if (res.status == 200) return alert("change password sucess");
    } catch (error) {
      console.error(error);
    }
  }

  async function changeemail(email: string) {
    try {
      const res = await axios.put("http://localhost:3000/changeemail", {
        email,
      });
      if (res.status == 200) return alert("change email sucess");
    } catch (error) {
      console.error(error);
    }
  }

  let navigate = useNavigate();
  async function logout() {
    setAuthToken("");
    navigate("/login");
    localStorage.removeItem("token");
  }
  return (
    <>
      <Button onClick={logout}>logout</Button>
      <Button onClick={() => setOpenModalemail(true)}>Change Email</Button>
      <Button onClick={() => setOpenModalpass(true)}>Change Password</Button>

      <Modal show={openModalemail} size="md" onClose={onCloseModalemail} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Change Email
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <Button onClick={() => changeemail(email)}>Change email</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openModalpasss}
        size="md"
        onClose={onCloseModalpassword}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Change Password
            </h3>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your Old password" />
              </div>
              <TextInput
                id="password"
                type="password"
                required
                value={oldpassword}
                onChange={(event) => setoldpassword(event.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your New password" />
              </div>
              <TextInput
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your retype new password" />
              </div>
              <TextInput
                id="password"
                type="password"
                required
                value={repassword}
                onChange={(event) => setRePassword(event.target.value)}
              />
            </div>

            <div className="w-full">
              <Button
                onClick={() =>
                  changePassword(oldpassword, password, repassword)
                }
              >
                Change Password
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
