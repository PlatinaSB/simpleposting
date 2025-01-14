import {
  Button,
  Card,
  Label,
  Modal,
  Textarea,
  TextInput,
} from "flowbite-react";
import { setAuthToken } from "./App";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

export default function PostManagement() {
  const [posts, setPosts] = useState<any[]>([]);
  const [modals, setModals] = useState({
    email: false,
    password: false,
    edit: false,
  });
  const [currentPost, setCurrentPost] = useState<{
    id: number;
    content: string;
  } | null>(null);
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const navigate = useNavigate();

  async function fetchUserPosts() {
    const userId = localStorage.getItem("userid");
    try {
      const response = await axios.get(`http://localhost:3000/posts/${userId}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  useEffect(() => {
    fetchUserPosts();
  }, []);

  async function deletePost(postId: number) {
    try {
      await axios.delete(`http://localhost:3000/posts/${postId}`);
      alert("Post deleted successfully.");
      fetchUserPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  async function updatePost(postId: number, content: string) {
    try {
      await axios.put(`http://localhost:3000/posts/${postId}`, {
        post: content,
      });
      alert("Post updated successfully.");
      fetchUserPosts();
      closeModal("edit");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  async function changeEmail() {
    try {
      const res = await axios.put("http://localhost:3000/changeemail", {
        email,
      });
      if (res.status === 200) {
        alert("Email changed successfully.");
        closeModal("email");
      }
    } catch (error) {
      console.error("Error changing email:", error);
    }
  }

  async function changePassword() {
    try {
      const res = await axios.put("http://localhost:3000/changepassword", {
        oldpassword: oldPassword,
        password,
        repassword: rePassword,
      });
      if (res.status === 200) {
        alert("Password changed successfully.");
        closeModal("password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  }

  function openModal(
    type: keyof typeof modals,
    post?: { id: number; content: string },
  ) {
    setModals((prev) => ({ ...prev, [type]: true }));
    if (type === "edit" && post) {
      setCurrentPost(post);
    }
  }

  function closeModal(type: keyof typeof modals) {
    setModals((prev) => ({ ...prev, [type]: false }));
    if (type === "edit") {
      setCurrentPost(null);
    }
  }

  function logout() {
    setAuthToken("");
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
  }

  return (
    <>
      <Button onClick={logout}>Logout</Button>
      <Button onClick={() => openModal("email")}>Change Email</Button>
      <Button onClick={() => openModal("password")}>Change Password</Button>

      {/* Change Email Modal */}
      <Modal
        show={modals.email}
        size="md"
        onClose={() => closeModal("email")}
        popup
      >
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
              <Button onClick={changeEmail}>Change Email</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        show={modals.password}
        size="md"
        onClose={() => closeModal("password")}
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
                <Label htmlFor="old-password" value="Your Old Password" />
              </div>
              <TextInput
                id="old-password"
                type="password"
                required
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="new-password" value="Your New Password" />
              </div>
              <TextInput
                id="new-password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="re-password" value="Retype New Password" />
              </div>
              <TextInput
                id="re-password"
                type="password"
                required
                value={rePassword}
                onChange={(event) => setRePassword(event.target.value)}
              />
            </div>
            <div className="w-full">
              <Button onClick={changePassword}>Change Password</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Post Modal */}
      <Modal
        show={modals.edit}
        size="md"
        onClose={() => closeModal("edit")}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="edit-post" value="Edit Your Post" />
            </div>
            <Textarea
              id="edit-post"
              placeholder="Post content"
              required
              rows={4}
              value={currentPost?.content || ""}
              onChange={(event) =>
                setCurrentPost(
                  (prev) => ({ ...prev, content: event.target.value }) as any,
                )
              }
            />
          </div>
          <Button
            onClick={() =>
              currentPost && updatePost(currentPost.id, currentPost.content)
            }
          >
            Edit Post
          </Button>
        </Modal.Body>
      </Modal>

      {/* Posts List */}
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.postid}>
              <h2 className="text-xl font-bold">
                {moment(post.created_unix).format("YYYY-MM-DD HH:mm:ss")}
              </h2>
              <p>{post.post}</p>
              <Button onClick={() => deletePost(post.postid)}>Delete</Button>
              <Button
                onClick={() =>
                  openModal("edit", { id: post.postid, content: post.post })
                }
              >
                Edit
              </Button>
            </Card>
          ))
        ) : (
          <p>Loading posts...</p>
        )}
      </div>
    </>
  );
}
