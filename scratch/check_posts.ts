import connectToDatabase from "./src/lib/mongodb";
import { Post } from "./src/models/Post";

async function checkPosts() {
  await connectToDatabase();
  const posts = await Post.find({}).limit(5).lean();
  console.log("Existing Posts:", JSON.stringify(posts, null, 2));
  process.exit(0);
}

checkPosts();
