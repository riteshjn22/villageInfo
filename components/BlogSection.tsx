import BlogBody from "./blogBody";

type BlogItem = {
  url: string;
  imageUrl: string;
  title: string;
  short_description: string;
};

export default function BlogSection({ blogData }: { blogData: BlogItem[] }) {
    return (
          <div className="mt-4 w-full">
                <h2 className="mb-4 text-base font-medium">Blogs</h2>
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  {/* deepak start - old code (replaced below):
                          {blogData?.map((item, index) => {
                                    return <BlogBody key={index} item={item} priority={index < 2} />;
                                            })}
                                                    deepak end - old code */}
                  {/* deepak start - new code: guard against blogData not being an array */}
                  {Array.isArray(blogData) && blogData.map((item, index) => {
                      return <BlogBody key={index} item={item} priority={index < 2} />;
          })}
                  {/* deepak end - new code */}
                </div>
          </div>
        );
}
