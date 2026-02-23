import { useState } from 'react';
import { LatestProgress } from './components/LatestProgress';
import { XPosts } from './components/XPosts';
import { EcosystemSpotlight } from './components/EcosystemSpotlight';
import { InvestingWisdom } from './components/InvestingWisdom';
import { TrustedResources } from './components/TrustedResources';
import { CybercrimeAwareness } from './components/CybercrimeAwareness';
import { MissionPage } from './components/MissionPage';
import { AdditionalResources } from './components/AdditionalResources';
import { HomePageLinks } from './components/HomePageLinks';
import { NavigationMenu } from './components/NavigationMenu';
import { SiInternetcomputer } from 'react-icons/si';

function App() {
  const [activeTab, setActiveTab] = useState('mission');

  const renderContent = () => {
    switch (activeTab) {
      case 'mission':
        return (
          <>
            <MissionPage />
            <div className="mt-8">
              <HomePageLinks />
            </div>
          </>
        );
      case 'progress':
        return <LatestProgress />;
      case 'xposts':
        return <XPosts />;
      case 'spotlight':
        return <EcosystemSpotlight />;
      case 'wisdom':
        return <InvestingWisdom />;
      case 'resources':
        return <TrustedResources />;
      case 'cybercrime':
        return <CybercrimeAwareness />;
      case 'additional-resources':
        return <AdditionalResources />;
      default:
        return (
          <>
            <MissionPage />
            <div className="mt-8">
              <HomePageLinks />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a0a2e]/50 to-[#0a0a1a]" />
        
        <header className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                <SiInternetcomputer className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Connect the Dots.ICP
                </h1>
                <p className="text-sm text-muted-foreground">Real Progress on the Internet Computer</p>
              </div>
            </div>
            <NavigationMenu activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </header>

        {/* Content Section */}
        <div className="relative z-10 container mx-auto px-4 pb-8">
          <div className="mt-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-16 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Connect the Dots.ICP
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Built with <span className="text-red-500">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
