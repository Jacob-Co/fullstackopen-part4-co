const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const pertinentInfo = (blog) => {
  return {
    author: blog.author,
    likes: blog.likes,
    title: blog.title,
  }
}

const favoriteBlog = (blogs) => {
  if (blogs.length < 1) return {};
  getMoreLikedBlog = (blog1, blog2) => blog1.likes > blog2.likes ? blog1 : blog2;
  return pertinentInfo(blogs.reduce(getMoreLikedBlog));
};

const mostBlogs = (blogs) => {
  if (blogs.length < 1) return {};
  let mostAuthor;
  let mostBlogs = 0;
  blogs.reduce((record, blog) => {
    record[blog.author] ? record[blog.author] += 1 : record[blog.author] = 1;
    if (record[blog.author] > mostBlogs) {
      mostAuthor = blog.author;
      mostBlogs = record[blog.author];
    }
    return record;
  }, {});

  return {author: mostAuthor, blogs: mostBlogs};
};

const mostLikes = (blogs) => {
  if (blogs.length < 1) return {};
  let mostAuthor;
  let mostLikes = 0;
  blogs.reduce((record, blog) => {
    record[blog.author]
      ? record[blog.author] += blog.likes
      : record[blog.author] = blog.likes;

    if (record[blog.author] > mostLikes || mostLikes === 0) {
      mostAuthor = blog.author;
      mostLikes = record[blog.author];
    }
    return record;
  }, {});

  return {author: mostAuthor, likes: mostLikes};
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};