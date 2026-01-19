import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Code2, Terminal, Trophy, Users } from "lucide-react";

function HomePage() {
        return (
                <div className="min-h-screen bg-black text-white relative flex flex-col overflow-hidden selection:bg-purple-500/30">
                        <Header />

                        {/* Background Gradients */}
                        <div className="fixed inset-0 z-0 pointer-events-none">
                                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                        </div>

                        <main className="flex-1 flex flex-col relative z-10">
                                {/* Hero Section */}
                                <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-32 space-y-8 max-w-5xl mx-auto">
                                        <div className="inline-flex items-center rounded-full border border-[#27272a] bg-[#27272a]/50 px-3 py-1 text-sm text-[#a1a1aa] mb-4 backdrop-blur-xl">
                                                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                                v2.0 Now Live
                                        </div>

                                        <div className="space-y-6">
                                                <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white drop-shadow-sm">
                                                        Level Up Your <br />
                                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Coding Skills</span>
                                                </h1>
                                                <p className="text-xl text-zinc-400 max-w-[600px] mx-auto leading-relaxed">
                                                        The ultimate platform for developers to practice algorithms, compete in real-time, and collaborate with friends.
                                                </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-8">
                                                <Link to="/practiceproblems">
                                                        <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-full font-medium transition-transform hover:scale-105">
                                                                Start Practicing
                                                        </Button>
                                                </Link>
                                                <Link to="/onlinecompiler">
                                                        <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 px-8 border-zinc-800 bg-black/50 hover:bg-zinc-900 text-zinc-100 rounded-full backdrop-blur-sm transition-transform hover:scale-105">
                                                                Open Compiler
                                                        </Button>
                                                </Link>
                                        </div>

                                        {/* Code Snippet Decoration */}
                                        <div className="mt-16 w-full max-w-4xl mx-auto rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl overflow-hidden hidden md:block group hover:border-white/20 transition-colors">
                                                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                                                        <div className="flex gap-2">
                                                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                                        </div>
                                                        <div className="text-xs text-zinc-500 font-mono ml-2">main.cpp</div>
                                                </div>
                                                <div className="p-6 font-mono text-sm text-left text-zinc-300">
                                                        <div className="text-purple-400">#include &lt;iostream&gt;</div>
                                                        <div className="text-blue-400 mt-2">int main() &#123;</div>
                                                        <div className="pl-4">std::cout &lt;&lt; <span className="text-green-400">"Hello, CodeVault!"</span> &lt;&lt; std::endl;</div>
                                                        <div className="pl-4 text-purple-400">return 0;</div>
                                                        <div>&#125;</div>
                                                </div>
                                        </div>
                                </section>

                                {/* Features Grid */}
                                <section className="container px-4 py-24 mx-auto grid md:grid-cols-3 gap-6">
                                        <Card className="bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300 backdrop-blur-sm group">
                                                <CardHeader>
                                                        <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                                                                <Code2 className="h-6 w-6 text-blue-400" />
                                                        </div>
                                                        <CardTitle className="text-white">Practice Problems</CardTitle>
                                                        <CardDescription className="text-zinc-400">
                                                                Access a vast library of coding challenges sorted by difficulty and topic.
                                                        </CardDescription>
                                                </CardHeader>
                                        </Card>

                                        <Card className="bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300 backdrop-blur-sm group">
                                                <CardHeader>
                                                        <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                                                <Terminal className="h-6 w-6 text-purple-400" />
                                                        </div>
                                                        <CardTitle className="text-white">Online Compiler</CardTitle>
                                                        <CardDescription className="text-zinc-400">
                                                                Run and test your code instantly in multiple languages with our powerful compiler.
                                                        </CardDescription>
                                                </CardHeader>
                                        </Card>

                                        <Card className="bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300 backdrop-blur-sm group">
                                                <CardHeader>
                                                        <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                                                                <Users className="h-6 w-6 text-green-400" />
                                                        </div>
                                                        <CardTitle className="text-white">Real-time Collaboration</CardTitle>
                                                        <CardDescription className="text-zinc-400">
                                                                Create rooms, invite friends, and solve problems together in real-time.
                                                        </CardDescription>
                                                </CardHeader>
                                        </Card>
                                </section>
                        </main>

                        <Footer />
                </div>
        );
}

export default HomePage;
