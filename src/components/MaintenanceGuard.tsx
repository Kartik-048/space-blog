'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Telescope, Radio, ShieldAlert } from 'lucide-react';
import AdminPanelModal from './AdminPanelModal';

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

export default function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string>(
    "Astronomia is currently under maintenance. We'll be back soon with your daily dose of space blogs!! "
  );
  const [adminOpen, setAdminOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const checkMaintenance = () => {
    fetch('/api/admin/maintenance')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMaintenanceMode(Boolean(data.maintenanceMode));
          if (data.maintenanceMessage) {
            setMaintenanceMessage(data.maintenanceMessage);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    checkMaintenance();
    const interval = setInterval(checkMaintenance, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTelescopeClick = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const next = clickCount + 1;
    if (next >= 6) {
      setAdminOpen(true);
      setClickCount(0);
    } else {
      setClickCount(next);
      timerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 3000);
    }
  };

  if (!maintenanceMode) {
    return <>{children}</>;
  }

  // Full-screen Maintenance Mode Screen
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-space-950 text-white overflow-hidden selection:bg-cosmic-cyan/30">
      {/* Background ambient nebula glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cosmic-purple/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cosmic-cyan/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-4xl flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cosmic-purple to-cosmic-cyan p-[1px]">
            <div className="w-full h-full rounded-full bg-space-950 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-cosmic-cyan animate-pulse" />
            </div>
          </div>
          <span className="font-serif tracking-widest text-lg font-bold">ASTRONOMIA</span>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cosmic-gold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>STATUS: STANDBY MODE</span>
        </div>
      </div>

      {/* Center Notice Container */}
      <div className="max-w-2xl text-center space-y-6 relative z-10 my-auto py-12">
        <div className="inline-flex p-3 rounded-2xl bg-cosmic-purple/20 border border-cosmic-purple/40 text-cosmic-purple shadow-glow-purple">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-tight">
          System Maintenance
        </h1>

        <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-light max-w-xl mx-auto">
          {maintenanceMessage}
        </p>

        <div className="pt-4 flex items-center justify-center space-x-3 text-xs font-mono text-slate-400">
          <span>COSMIC TELEMETRY ENGINE</span>
          <span>&bull;</span>
          <span>RECALIBRATING SENSORS</span>
        </div>
      </div>

      {/* Bottom Footer with Hidden 6-Click Telescope Trigger */}
      <div className="w-full max-w-4xl pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-500 font-mono relative z-10">
        <div className="flex items-center space-x-2">
          {/* Subtle telescope trigger with default pointer */}
          <span
            onClick={handleTelescopeClick}
            className="inline-block cursor-default select-none"
            style={{ cursor: 'default' }}
            aria-hidden="true"
          >
            <Telescope className="w-4 h-4 text-slate-600 hover:text-slate-500 transition-colors" />
          </span>
          <span>&copy; {new Date().getFullYear()} Astronomia Network</span>
        </div>

        <span>TEMPORARY ORBITAL PAUSE</span>
      </div>

      {/* Admin Panel Modal to unlock / turn off maintenance mode */}
      <AdminPanelModal
        isOpen={adminOpen}
        onClose={() => {
          setAdminOpen(false);
          checkMaintenance();
        }}
      />
    </div>
  );
}
