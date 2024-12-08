import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Twitter, TrendingUp, Bot } from "lucide-react";
import Header from "../components/Layout/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-4">
              Supercharge Your Token's{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Social Presence
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Leverage AI-powered social media management to increase your
              token's visibility and engagement across platforms.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/dashboard/pump"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition-all"
            >
              Start Pumping
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mt-20"
        >
          <div className="bg-background-light p-6 rounded-xl border border-primary/20">
            <Twitter className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Social Posts</h3>
            <p className="text-gray-400">
              Our AI generates engaging content optimized for maximum reach and
              engagement on Twitter.
            </p>
          </div>

          <div className="bg-background-light p-6 rounded-xl border border-primary/20">
            <Bot className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Strategy</h3>
            <p className="text-gray-400">
              Advanced algorithms analyze market sentiment and trending topics
              to optimize your token's visibility.
            </p>
          </div>

          <div className="bg-background-light p-6 rounded-xl border border-primary/20">
            <TrendingUp className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Performance</h3>
            <p className="text-gray-400">
              Monitor your token's social performance with detailed analytics
              and insights.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
