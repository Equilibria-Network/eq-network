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
      <main className="container max-w-4xl mx-auto px-4 py-12 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-4 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Equilibria
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The Collective Intelligence and Coordination Network
          </p>
        </section>

        {/* Research Focus */}
        <section className="space-y-6 animate-fade-up">
          <h2 className="text-3xl font-semibold text-gray-900">Research Focus</h2>
          <p className="text-gray-600">
            We study how groups can make better decisions together as challenges grow more complex. Our research integrates insights from:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-hover bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Information Theory & Collective Intelligence</h3>
              <p className="text-gray-600">Understanding how information flows through networks and how collective wisdom emerges</p>
            </div>
            <div className="card-hover bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Active Inference & System Design</h3>
              <p className="text-gray-600">Analyzing how systems maintain stability while adapting to new information</p>
            </div>
            <div className="card-hover bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Trust-Truth Dynamics</h3>
              <p className="text-gray-600">Exploring how groups balance maintaining relationships with pursuing accurate beliefs</p>
            </div>
            <div className="card-hover bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Scale-Bridging Architecture</h3>
              <p className="text-gray-600">Investigating how coordination patterns work across different scales, from small teams to global systems</p>
            </div>
          </div>
        </section>

        {/* Product Focus */}
        <section className="space-y-6 animate-fade-up">
          <h2 className="text-3xl font-semibold text-gray-900">Product Focus</h2>
          <p className="text-gray-600">
            We support the development of tools and frameworks that help groups coordinate effectively. Our product work centers on:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-hover bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Collaborative Decision Tools</h3>
              <p className="text-gray-600">Supporting groups in reaching alignment while maintaining diverse perspectives</p>
            </div>
            <div className="card-hover bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Network Analysis & Visualization</h3>
              <p className="text-gray-600">Making complex relationships and dynamics visible and actionable</p>
            </div>
            <div className="card-hover bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Belief Updating Systems</h3>
              <p className="text-gray-600">Helping organizations integrate new information effectively</p>
            </div>
            <div className="card-hover bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Cross-Scale Coordination Protocols</h3>
              <p className="text-gray-600">Building bridges between different levels of organization</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-6 bg-secondary p-8 rounded-xl animate-fade-up">
          <h2 className="text-2xl font-semibold text-gray-900">
            Join Our Network
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us in developing the frameworks and tools needed for effective coordination in an increasingly complex world. Whether you're a researcher, builder, or practitioner, we provide spaces to connect, collaborate, and create impact.
          </p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="input-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="button-primary w-full">
              Get Involved
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Index;