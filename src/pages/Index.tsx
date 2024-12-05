import { useState } from "react";
import { Button } from "@/components/ui/button";
import EmailOctopusForm from "@/components/EmailOctopusForm.tsx";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/70 to-green-50/50">
      {/* Hero Section with New Image */}
      <div 
        className="h-[70vh] relative bg-cover bg-center"
        style={{
          backgroundImage: 'url("/lovable-uploads/9c17967d-7c96-454d-be74-3a9c6a37fdc1.png")',
          backgroundPosition: 'center 40%'
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container max-w-6xl mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-6xl md:text-7xl font-serif text-white mb-6">
            Equilibria
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light">
            The Collective Intelligence and Coordination Network
          </p>
        </div>
      </div>

      <main className="container max-w-6xl mx-auto px-4 py-20 space-y-20">
        {/* Introduction Text */}
        <section className="space-y-8">
          <h2 className="text-3xl font-serif text-[#1a3c5b] text-center mb-6">Our Vision</h2>
          <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-lg p-8">
            <div className="prose prose-lg max-w-4xl mx-auto space-y-6 text-black/80">
              <p className="leading-relaxed">
                Humanity stands at a critical juncture. As artificial intelligence rapidly advances, our ability to make wise collective decisions becomes increasingly vital – yet our existing institutions and coordination systems struggle to keep pace with mounting complexity.
              </p>
              <p className="leading-relaxed">
                Across many fields, we see fascinating experiments emerging that hint at new possibilities: Digital democracy platforms are transforming public engagement. Novel organizational structures like zebra groups are reimagining risk-sharing. Researchers are uncovering promising frameworks for collective intelligence. While no single approach has all the answers, these experiments suggest paths forward for combining human wisdom with computational tools.
              </p>
              <p className="leading-relaxed">
                We believe there's a timely opportunity to weave these threads together. Equilibria was founded to create space for this exploration through an experimental incubator that nurtures projects at the frontier of human-AI coordination. Our hypothesis is that by bringing together researchers, builders, and practitioners in new ways, we can accelerate progress toward better coordination systems.
              </p>
              <p className="leading-relaxed">
                We're committed to learning in public, sharing our uncertainties as well as our insights, and building alongside others who share this curiosity about what's possible.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Research Stream */}
          <section className="space-y-6">
            <h2 className="text-3xl font-serif text-[#1a3c5b] mb-6">Research Stream</h2>
            <p className="text-black/80 leading-relaxed">
              We study how groups can make better decisions together as challenges grow more complex. Our research integrates insights from:
            </p>
            <div className="space-y-6">
              <div className="p-6 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-medium text-[#1a3c5b] mb-2">Information Theory & Collective Intelligence</h3>
                <p className="text-black/70">Understanding how information flows through networks and how collective wisdom emerges</p>
              </div>
              <div className="p-6 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-medium text-[#1a3c5b] mb-2">Active Inference & System Design</h3>
                <p className="text-black/70">Analyzing how systems maintain stability while adapting to new information</p>
              </div>
            </div>
          </section>

          {/* Product Stream */}
          <section className="space-y-6">
            <h2 className="text-3xl font-serif text-[#1a3c5b] mb-6">Product Stream</h2>
            <p className="text-black/80 leading-relaxed">
              We support the development of tools and frameworks that help groups coordinate effectively. Our product work centers on:
            </p>
            <div className="space-y-6">
              <div className="p-6 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-medium text-[#1a3c5b] mb-2">Collaborative Decision Tools</h3>
                <p className="text-black/70">Supporting groups in reaching alignment while maintaining diverse perspectives</p>
              </div>
              <div className="p-6 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-medium text-[#1a3c5b] mb-2">Network Analysis & Visualization</h3>
                <p className="text-black/70">Making complex relationships and dynamics visible and actionable</p>
              </div>
            </div>
          </section>
        </div>

        {/* Express Interest Button */}
        <div className="text-center">
          <Button 
            asChild 
            className="w-full max-w-xl mx-auto bg-emerald-600 hover:bg-emerald-700"
          >
            <a 
              href="https://forms.gle/iFaehTPDDJuGuUcT9"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Expression of Interest for Joining a Stream
            </a>
          </Button>
        </div>

        {/* Incubator Section */}
        <section className="space-y-8">
          <div 
            className="relative bg-cover bg-center rounded-lg overflow-hidden"
            style={{
              backgroundImage: 'url("/lovable-uploads/e6d27c93-c520-4694-9824-9f4b54e1d13e.png")',
              minHeight: '600px'
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 p-8 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-lg p-8">
                <div className="prose prose-lg space-y-6 text-black/80">
                  <h3 className="text-2xl font-serif text-[#1a3c5b] mb-4">Our Experimental Incubator Model</h3>
                  <p className="leading-relaxed">
                    We're building a different kind of incubator - one that practices the principles of better coordination it seeks to promote. Rather than following traditional accelerator models, we're exploring new ways to nurture projects that enhance human-AI coordination.
                  </p>
                  <p className="leading-relaxed">
                    Drawing inspiration from decentralized science and novel organizational structures, we envision an incubator where collective intelligence tools guide project selection, where teams share risks and rewards through zebra group structures, and where knowledge becomes part of a growing commons that benefits all participants.
                  </p>
                  <p className="leading-relaxed">
                    Our first steps are deliberate and experimental. Through our current events and research initiatives, we're learning what founders in this space need, what structures enable genuine collaboration, and how to measure impact in coordination technologies. These insights will shape our first cohort.
                  </p>
                  <h4 className="text-xl font-medium text-[#1a3c5b] mt-6 mb-4">Key elements we're exploring:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Using collective intelligence algorithms to match founders with opportunities and collaborators</li>
                    <li>Implementing novel governance structures that align incentives across projects</li>
                    <li>Building shared knowledge commons that grow more valuable with each cohort</li>
                    <li>Testing new frameworks for measuring coordination capacity and impact</li>
                  </ul>
                  <p className="leading-relaxed mt-6">
                    We're currently connecting with potential founders, mentors, and partners who share our curiosity about these possibilities. If you're interested in being part of our first cohort or contributing to the development of our model, we'd love to hear from you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

          {/* Newsletter Section */}
          <section className="max-w-xl mx-auto">
            <EmailOctopusForm />
          </section>

        {/* Footer */}
        <footer className="text-center space-y-4 pt-12 border-t border-emerald-100">
          <img 
            src="/lovable-uploads/30b10e59-0ac0-4796-8711-fa380fd1d7b9.png" 
            alt="Equilibria Network Logo" 
            className="h-16 mx-auto"
          />
          <p className="text-black/60 text-sm">
            Copyright © {new Date().getFullYear()} Equilibria Network. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
