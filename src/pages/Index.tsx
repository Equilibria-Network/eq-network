import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Index = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing!");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Equilibria
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The Collective Intelligence and Coordination Network
          </p>
        </section>

        {/* Upcoming Events */}
        <section className="space-y-6 animate-fade-up">
          <h2 className="text-2xl font-semibold text-gray-900">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-hover bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Community Meetup</h3>
              <p className="text-gray-600">Join us for our monthly community gathering</p>
              <p className="text-primary mt-2">March 15, 2024</p>
            </div>
            <div className="card-hover bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Workshop Series</h3>
              <p className="text-gray-600">Learn about collective intelligence</p>
              <p className="text-primary mt-2">March 22, 2024</p>
            </div>
          </div>
        </section>

        {/* Streams Section */}
        <section className="grid md:grid-cols-2 gap-8 animate-fade-up">
          {/* Research Stream */}
          <div className="bg-secondary p-8 rounded-xl space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Research Stream
            </h2>
            <p className="text-gray-600">
              Explore cutting-edge research in collective intelligence and coordination mechanisms.
            </p>
            <Button className="button-primary w-full">
              Apply Now
            </Button>
          </div>

          {/* Product Stream */}
          <div className="bg-secondary p-8 rounded-xl space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Product Stream
            </h2>
            <p className="text-gray-600">
              Build and develop products that enhance collective coordination.
            </p>
            <Button className="button-primary w-full">
              Apply Now
            </Button>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="max-w-xl mx-auto text-center space-y-6 animate-fade-up">
          <h2 className="text-2xl font-semibold text-gray-900">
            Sign up to stay coordinated
          </h2>
          <form onSubmit={handleSubscribe} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="input-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="button-primary w-full">
              Subscribe to Newsletter
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Index;