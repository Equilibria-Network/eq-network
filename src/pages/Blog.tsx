const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/70 to-green-50/50">
      {/* Hero Section */}
      <div 
        className="h-[40vh] relative bg-emerald-900/10 backdrop-blur"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container max-w-6xl mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-6xl md:text-7xl font-serif text-[#1a3c5b] mb-6">
            Our Blog
          </h1>
          <p className="text-xl md:text-2xl text-[#1a3c5b]/80 max-w-2xl font-light">
            Insights on Collective Intelligence and Coordination
          </p>
        </div>
      </div>

      <main className="container max-w-6xl mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Example Blog Posts */}
          <article className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="aspect-video bg-emerald-100"></div>
            <div className="p-6">
              <h3 className="text-xl font-serif text-[#1a3c5b] mb-2">The Future of Collective Decision Making</h3>
              <p className="text-black/70 mb-4">Exploring how emerging technologies are reshaping group coordination and consensus building.</p>
              <span className="text-sm text-black/50">March 15, 2024</span>
            </div>
          </article>

          <article className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="aspect-video bg-emerald-100"></div>
            <div className="p-6">
              <h3 className="text-xl font-serif text-[#1a3c5b] mb-2">Information Theory in Practice</h3>
              <p className="text-black/70 mb-4">How modern organizations are applying information theory principles to improve decision-making.</p>
              <span className="text-sm text-black/50">March 10, 2024</span>
            </div>
          </article>

          <article className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="aspect-video bg-emerald-100"></div>
            <div className="p-6">
              <h3 className="text-xl font-serif text-[#1a3c5b] mb-2">Active Inference: A Primer</h3>
              <p className="text-black/70 mb-4">Understanding the fundamentals of active inference and its applications in system design.</p>
              <span className="text-sm text-black/50">March 5, 2024</span>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default Blog;