import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Home, Search, Library, Settings, Music2, Menu, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function Sidebar() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { icon: Home, label: t('home'), href: '/' },
    { icon: Search, label: t('search'), href: '/search' },
    { icon: Library, label: t('library'), href: '/library' },
    { icon: Settings, label: t('settings'), href: '/settings' },
  ];

  const isActive = (href: string) => router.pathname === href;

  const NavContent = () => (
    <nav className="flex flex-col h-full p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center glow-sm"
             style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
          <Music2 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-sm font-bold text-glow" style={{ color: '#c084fc' }}>
            PURPLE
          </h1>
          <p className="text-xs text-purple-400 opacity-70 font-body">MUSIC</p>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-2 flex-1">
        {navItems.map(({ icon: Icon, label, href }) => (
          <motion.button
            key={href}
            onClick={() => { router.push(href); setMobileOpen(false); }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
              isActive(href)
                ? 'glass-strong text-purple-300 glow-sm'
                : 'text-purple-200/60 hover:text-purple-200 hover:glass'
            }`}
          >
            <Icon size={20} className={isActive(href) ? 'text-purple-400' : ''} />
            <span className="font-body font-medium text-sm">{label}</span>
            {isActive(href) && (
              <motion.div
                layoutId="activeIndicator"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Bottom decoration */}
      <div className="mt-4 px-2 py-3 rounded-xl glass text-center">
        <p className="text-xs text-purple-400/60 font-body">Ultimate Purple Music</p>
        <p className="text-xs text-purple-500/40 font-body">v1.0.0</p>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden glass rounded-xl p-2.5"
      >
        <Menu size={20} className="text-purple-300" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: mobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-64 z-50 md:hidden glass-strong"
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-purple-400"
        >
          <X size={20} />
        </button>
        <NavContent />
      </motion.div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-56 lg:w-64 flex-shrink-0 glass-strong border-r border-purple-800/20">
        <div className="w-full">
          <NavContent />
        </div>
      </div>
    </>
  );
}
