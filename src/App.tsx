/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { CartProvider, useCart } from './context/CartContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { OrderModesBar } from './components/home/OrderModesBar';
import { AboutSection } from './components/home/AboutSection';
import { MenuSection } from './components/menu/MenuSection';
import { OffersSection } from './components/home/OffersSection';
import { GallerySection } from './components/home/GallerySection';
import { ReviewsSection } from './components/home/ReviewsSection';
import { ReservationAndBlogSection } from './components/home/ReservationAndBlogSection';
import { LocationFaqSection } from './components/home/LocationFaqSection';
import { CateringModal } from './components/home/CateringModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { ItemCustomizeModal } from './components/menu/ItemCustomizeModal';
import { AdminModal } from './components/admin/AdminModal';
import { ChatbotWidget } from './components/common/ChatbotWidget';
import { VoiceAssistantWidget } from './components/common/VoiceAssistantWidget';
import { WebsiteAudioPlayer } from './components/common/WebsiteAudioPlayer';

const MainStorefront: React.FC = () => {
  const { data } = useRestaurant();
  const { customizingItem, setCustomizingItem } = useCart();

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin';
    }
    return false;
  });
  const [isCateringOpen, setIsCateringOpen] = useState(false);

  // Sync dynamic CSS theme variables and SEO title/meta tags
  useEffect(() => {
    const root = document.documentElement;
    if (data.profile.primaryColor) {
      root.style.setProperty('--primary', data.profile.primaryColor);
    }
    if (data.profile.secondaryColor) {
      root.style.setProperty('--secondary', data.profile.secondaryColor);
    }
    if (data.profile.accentColor) {
      root.style.setProperty('--green', data.profile.accentColor);
    }
    if (data.profile.headingFont) {
      root.style.setProperty('--font-heading', data.profile.headingFont);
    }
    if (data.profile.bodyFont) {
      root.style.setProperty('--font-body', data.profile.bodyFont);
    }

    if (data.seo?.metaTitle) {
      document.title = data.seo.metaTitle;
    } else if (data.profile?.name) {
      document.title = `${data.profile.name} — ${data.profile.tagline || 'Fast Food & Dining'}`;
    }

    if (data.seo?.metaDescription) {
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', data.seo.metaDescription);
      }
    }
  }, [data.profile, data.seo]);

  // Listen for #admin hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a1a1a] selection:bg-[#e8281a] selection:text-white">
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminOpen={isAdminOpen}
      />

      <main className="flex-1">
        <HeroSection />
        <OrderModesBar />
        <AboutSection />
        <MenuSection />
        <OffersSection />
        <GallerySection />
        <ReviewsSection />
        <ReservationAndBlogSection />
        <LocationFaqSection onOpenCatering={() => setIsCateringOpen(true)} />
      </main>

      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Cart & Dish Customization Modals */}
      <CartDrawer />
      {customizingItem && (
        <ItemCustomizeModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
        />
      )}

      {/* Catering / Party Inquiry Modal */}
      <CateringModal
        isOpen={isCateringOpen}
        onClose={() => setIsCateringOpen(false)}
      />

      {/* Welcome Audio, AI Voice Assistant & Smart Chatbot Widgets */}
      <WebsiteAudioPlayer />
      <VoiceAssistantWidget />
      <ChatbotWidget />

      {/* Full-Screen Admin Dashboard Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <RestaurantProvider>
        <CartProvider>
          <MainStorefront />
        </CartProvider>
      </RestaurantProvider>
    </ErrorBoundary>
  );
}
