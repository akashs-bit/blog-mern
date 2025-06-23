import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import store from "../redux/store.js";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Bookmark, MessageSquare, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import CommentBox from "../components/CommentBox";
import { toast } from "sonner";
import axios from "axios";
import { setBlog } from "../redux/blogSlice.js";

const BlogView = () => {
  const params = useParams();
  const blogId = params.blogId;
  const { blog } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);
  const selectedBlog = blog.find((blog) => blog._id === blogId);
  const [blogLike, setBlogLike] = useState(selectedBlog?.likes.length);
  const dispatch = useDispatch()
  const [liked, setLiked] = useState(
    selectedBlog?.likes.includes(user?._id) || false
  );

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:3000/api/v1/blog/${selectedBlog?._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
        setBlogLike(updatedLikes);
        setLiked(!liked);

        //apne blog ko update krunga
        const updatedBlogData = blog.map((p) =>
          p._id === selectedBlog._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        toast.success(res.data.message);
        dispatch(setBlog(updatedBlogData));
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleShare = (blogId) => {
    const blogUrl = `${window.location.origin}/blogs/${blogId}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this blog!",
          text: "Read this amazing blog post.",
          url: blogUrl,
        })
        .then(() => console.log("Shared successfully"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // fallback: copy to clipboard
      navigator.clipboard.writeText(blogUrl).then(() => {
        toast.success("Blog link copied to clipboard!");
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const changeTimeFormat = (isoDate) => {
    const date = new Date(isoDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  };
  return (
    <div className="pt-14">
      <div className="max-w-6xl mx-auto p-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to={"/"}>
                <BreadcrumbLink>Home</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <Link to={"/blogs"}>
                <BreadcrumbLink>Blogs</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Blog Header */}
        <div className="my-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {selectedBlog.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={selectedBlog.author.photoUrl}
                    alt="Author"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedBlog.author.firstName}{" "}
                    {selectedBlog.author.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBlog.author.occupation}
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Published on {changeTimeFormat(selectedBlog.createdAt)} • 8 min
                read
              </div>
            </div>
            {/* Featured Image */}
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={selectedBlog?.thumbnail}
                alt="Next.js Development"
                width={1000}
                height={500}
                className="w-full object-cover"
              />
              <p className="text-sm text-muted-foreground mt-2 italic">
                {selectedBlog.subtitle}
              </p>
            </div>
            <div
              className="prose prose-lg max-w-none text-black dark:text-white [&_*]:!text-black dark:[&_*]:!text-white"
              dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
            ></div>

            <div className="mt-10">
              {/* Tags */}
              <Badge className="bg-black text-white border border-gray-300 dark:bg-white dark:text-black dark:border-gray-700">
                Asalauter
              </Badge>
              <Badge className="bg-black text-white border border-gray-300 dark:bg-white dark:text-black dark:border-gray-700">
                Become Coach
              </Badge>
              <Badge className="bg-black text-white border border-gray-300 dark:bg-white dark:text-black dark:border-gray-700">
                Analyst
              </Badge>
            </div>
            {/* Engagement */}
            <div className="flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={likeOrDislikeHandler}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {liked ? (
                    <FaHeart size={24} className="cursor-pointer" />
                  ) : (
                    <FaRegHeart size={24} className="cursor-pointer" />
                  )}

                  <span>{blogLike}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span> Comments</span>
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleShare(selectedBlog._id)}
                  variant="ghost"
                  size="sm"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <CommentBox selectedBlog={selectedBlog} />
        </div>
      </div>
    </div>
  );
};

export default BlogView;
