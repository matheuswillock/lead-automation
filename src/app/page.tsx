"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, MapPin, Users, CheckCircle2, ArrowRight, Download, MessageCircle, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import Header from "@/components/landingPage/Header";
import Hero from '../components/landingPage/Hero';
import Features from "@/components/landingPage/Features";
import HowItWorks from '../components/landingPage/HowItWorks';
import Pricing from '../components/landingPage/Pricing';
import Footer from '../components/landingPage/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}
