import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Card } from "flowbite-react";

export default function Component() {
  const [posts, setPosts] = useState<any[]>([]);

  async function getPosts() {
    try {
      const response = await axios.get("http://localhost:3000/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  useEffect(() => {
    getPosts();
  }, []); // Fetch posts when the component mounts

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.postid}>
            <h2 className="text-xl font-bold">
              {moment.unix(post.created_unix).format("YYYY-MM-DD HH:mm:ss")}
            </h2>
            <p>{post.post}</p>
          </Card>
        ))
      ) : (
        <p>Loading posts...</p>
      )}
    </div>
  );
}
