import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Card } from "flowbite-react";

export default function PostsComponent() {
  const [posts, setPosts] = useState<any[]>([]);

  async function fetchPosts() {
    try {
      const response = await axios.get("http://localhost:3000/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []); // Fetch posts when the component mounts

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.postid} className="mb-4">
            <h2 className="text-xl font-bold">
              {moment(post.created_unix).format("YYYY-MM-DD HH:mm:ss")}
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
