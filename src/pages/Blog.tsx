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
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#1a3c5b] mb-4">
            Coming Soon
          </h2>
          <p className="text-lg text-[#1a3c5b]/80 max-w-2xl">
            We're preparing thoughtful content about collective intelligence, coordination, and the future of decision-making. Check back soon!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Blog;