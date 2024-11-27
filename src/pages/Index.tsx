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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <main className="container max-w-6xl mx-auto px-4 py-12 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-4 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
            Equilibria
          </h1>
          <p className="text-xl text-emerald-800 max-w-2xl mx-auto">
            The Collective Intelligence and Coordination Network
          </p>
        </section>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Research Stream */}
          <section className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-emerald-100 shadow-lg shadow-emerald-100/20 animate-fade-up">
            <h2 className="text-3xl font-semibold text-emerald-800 mb-6">Research Stream</h2>
            <div className="space-y-6">
              <p className="text-emerald-700">
                We study how groups can make better decisions together as challenges grow more complex. Our research integrates insights from:
              </p>
              <div className="space-y-4">
                <div className="card-hover bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold mb-2 text-emerald-800">Information Theory & Collective Intelligence</h3>
                  <p className="text-emerald-600">Understanding how information flows through networks and how collective wisdom emerges</p>
                </div>
                <div className="card-hover bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold mb-2 text-emerald-800">Active Inference & System Design</h3>
                  <p className="text-emerald-600">Analyzing how systems maintain stability while adapting to new information</p>
                </div>
                <div className="card-hover bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold mb-2 text-emerald-800">Trust-Truth Dynamics</h3>
                  <p className="text-emerald-600">Exploring how groups balance maintaining relationships with pursuing accurate beliefs</p>
                </div>
                <div className="card-hover bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold mb-2 text-emerald-800">Scale-Bridging Architecture</h3>
                  <p className="text-emerald-600">Investigating how coordination patterns work across different scales</p>
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => window.open('https://forms.gle/Zfy4H5CnBsoPPX5aA', '_blank')}>Apply to Research Stream</Button>
            </div>
          </section>

          {/* Product Stream */}
          <section className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-emerald-100 shadow-lg shadow-emerald-100/20 animate-fade-up">
            <h2 className="text-3xl font-semibold text-emerald-800 mb-6">Product Stream</h2>
            <div className="space-y-6">
              <p className="text-emerald-700">
                We support the development of tools and frameworks that help groups coordinate effectively. Our product work centers on:
              </p>
              <div className="space-y-4">
                <div className="card-hover bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold mb-2 text-emerald-800">Collaborative Decision Tools</h3>
                  <p className="text-emerald-600">Supporting groups in reaching alignment while maintaining diverse perspectives</p>
                </div>
                <div className="card-hover bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold mb-2 text-emerald-800">Network Analysis & Visualization</h3>
                  <p className="text-emerald-600">Making complex relationships and dynamics visible and actionable</p>
                </div>
                <div className="card-hover bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold mb-2 text-emerald-800">Belief Updating Systems</h3>
                  <p className="text-emerald-600">Helping organizations integrate new information effectively</p>
                </div>
                <div className="card-hover bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold mb-2 text-emerald-800">Cross-Scale Coordination Protocols</h3>
                  <p className="text-emerald-600">Building bridges between different levels of organization</p>
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => window.open('https://forms.gle/Zfy4H5CnBsoPPX5aA', '_blank')}>Apply to Product Stream</Button>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <section className="text-center space-y-6 bg-emerald-50/50 backdrop-blur-sm p-8 rounded-xl border border-emerald-100 animate-fade-up">
          <h2 className="text-2xl font-semibold text-emerald-800">
            Join Our Network
          </h2>
          <p className="text-emerald-700 max-w-2xl mx-auto">
            Join us in developing the frameworks and tools needed for effective coordination in an increasingly complex world. Whether you're a researcher, builder, or practitioner, we provide spaces to connect, collaborate, and create impact.
          </p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Get Involved
            </Button>
          </form>
        </section>

        {/* Footer */}
        <footer className="text-center space-y-4 pt-12 border-t border-emerald-100">
          <img 
            src="/lovable-uploads/30b10e59-0ac0-4796-8711-fa380fd1d7b9.png" 
            alt="Equilibria Network Logo" 
            className="h-16 mx-auto" // Changed from h-8 to h-16
          />
          <p className="text-emerald-600 text-sm">
            Copyright © {new Date().getFullYear()} Equilibria Network. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
