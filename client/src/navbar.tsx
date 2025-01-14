import { Button, Navbar } from "flowbite-react";

export default function Navabar() {
  const token = localStorage.getItem("token");

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <img
          src="vite.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Simple Posting
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {!token ? (
          <Button href="/register">Register</Button>
        ) : (
          <Button href="/user">accunt</Button>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" active>
          Home
        </Navbar.Link>
        <Navbar.Link href=""></Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
