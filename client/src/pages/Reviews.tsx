import Navbar from "@/components/Navbar";
import BlogReviews from "@/components/BlogReviews";

export default function Reviews() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            실제 고객 후기
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            네이버·당근·숨고에서 받은 실제 고객 후기입니다.
          </p>
        </div>
        <BlogReviews />
      </div>
    </main>
  );
}
