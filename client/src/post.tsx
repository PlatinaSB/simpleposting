import axios from "axios";
import { Button, Label, Modal, Textarea } from "flowbite-react";
import { useState } from "react";

export default function postComponent() {
  const [openPostForm, setOpenPostForm] = useState(false);
  const [post, setPost] = useState("");

  function onCloseModal() {
    setOpenPostForm(false);
    setPost("");
  }

  async function posts(post: string) {
    try {
      await axios.post("http://localhost:3000/posts", { post });
      alert("Post updated successfully.");
      window.location.reload();
      onCloseModal();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Button onClick={() => setOpenPostForm(true)}>Post</Button>
      <Modal show={openPostForm} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Post
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="post" value="Your post" />
              </div>
              <Textarea
                id="post"
                value={post}
                onChange={(event) => setPost(event.target.value)}
                required
              />
            </div>

            <Button onClick={() => posts(post)}>Post</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

