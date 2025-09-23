import { Trees, Users, MapPin, Lightbulb } from 'lucide-react';
import { Card } from '../components/ui/card';
import ChatBot from '../components/ChatBot';
import heroImage from '../assets/fra-hero-image.jpg';

const Index = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="relative bg-gradient-primary text-primary-foreground py-12 px-4 overflow-hidden">
        {/* Background Hero Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Rural communities accessing government schemes through digital interface"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-primary/80"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-3">
              <div className="p-3 bg-white/10 rounded-xl">
                <Trees size={32} />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-balance">
                FRA DSS Assistant
              </h1>
            </div>
            <p className="text-xl opacity-90 max-w-2xl mx-auto text-balance">
              Your intelligent guide to government schemes for rural and forest-dwelling communities
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="p-4 bg-white/10 border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Lightbulb size={20} className="text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">20+ Schemes</p>
                  <p className="text-sm opacity-80">Government programs</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-white/10 border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent rounded-lg">
                  <MapPin size={20} className="text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold">15 Villages</p>
                  <p className="text-sm opacity-80">Sample database</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-white/10 border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary-dark rounded-lg">
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold">Personalized</p>
                  <p className="text-sm opacity-80">Recommendations</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold mb-4">
              Get Instant Guidance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Ask questions about government schemes, get village-specific recommendations, 
              or explore opportunities for your community.
            </p>
          </div>
          
          <ChatBot />
          
          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-[var(--shadow-glow)] transition-shadow">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="font-semibold mb-2">Agriculture Schemes</h3>
              <p className="text-sm text-muted-foreground">
                PM-KISAN, crop insurance, and farming support programs
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-[var(--shadow-glow)] transition-shadow">
              <div className="text-4xl mb-3">🌲</div>
              <h3 className="font-semibold mb-2">Forest Rights</h3>
              <p className="text-sm text-muted-foreground">
                FRA implementation, Van Dhan, and forest produce schemes
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-[var(--shadow-glow)] transition-shadow">
              <div className="text-4xl mb-3">🏥</div>
              <h3 className="font-semibold mb-2">Health & Welfare</h3>
              <p className="text-sm text-muted-foreground">
                Ayushman Bharat, healthcare, and wellness programs
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-[var(--shadow-glow)] transition-shadow">
              <div className="text-4xl mb-3">💼</div>
              <h3 className="font-semibold mb-2">Employment</h3>
              <p className="text-sm text-muted-foreground">
                MGNREGA, MUDRA loans, and livelihood opportunities
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            Built to empower rural and forest-dwelling communities with accessible information
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            🌿 Supporting sustainable development and community welfare
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
