import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Recycle, ArrowRight, BarChart3, Truck, Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-[url('https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 backdrop-blur-sm"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
                Turn Your Scrap Into Cash
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                The sustainable way to sell your scrap materials for the best price, collected right from your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="px-8 bg-white text-primary hover:bg-white/90">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our easy and convenient process to turn your scrap materials into money
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Step cards with same structure but updated styling */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Request Pickup</h3>
                <p className="text-muted-foreground text-center">
                  Create a scrap selling request with details about your materials, weight, and preferred pickup time.
                </p>
              </div>
              
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Staff Collection</h3>
                <p className="text-muted-foreground text-center">
                  Our professional staff will come to your location to collect and weigh the scrap materials.
                </p>
              </div>
              
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Get Paid</h3>
                <p className="text-muted-foreground text-center">
                  Receive payment for your scrap materials based on weight and current market rates.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-20 bg-[url('https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-background/95"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EcoScrap</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We make recycling profitable and easy for everyone
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-primary/10">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Best Market Rates</h3>
                <p className="text-muted-foreground">
                  We offer competitive prices for all types of scrap materials, ensuring you get the best value.
                </p>
              </div>
              
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-primary/10">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mb-6">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Doorstep Collection</h3>
                <p className="text-muted-foreground">
                  Our team comes to your location, saving you time and the hassle of transporting materials.
                </p>
              </div>
              
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-primary/10">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mb-6">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Eco-Friendly</h3>
                <p className="text-muted-foreground">
                  By recycling materials, you're contributing to a sustainable future and reducing waste.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
                Ready to Start Recycling?
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Join thousands of satisfied users who are making money while helping the environment.
              </p>
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="px-8">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}