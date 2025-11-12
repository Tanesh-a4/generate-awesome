import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HeroHeader } from './header'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ChevronRight, Sparkles, Code, Zap, Globe, Download, Eye } from 'lucide-react'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-x-hidden">
                <section>
                    <div className="py-24 md:pb-32 lg:pb-36 lg:pt-72">
                        <div className="relative mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl">Generate Awesome Projects with AI</h1>
                                <p className="mt-8 max-w-2xl text-balance text-lg">Create stunning websites and applications in seconds using AI-powered project generation. From concept to code, instantly.</p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-12 rounded-full pl-5 pr-3 text-base">
                                        <Link href="/dashboard">
                                            <span className="text-nowrap">Start Generating</span>
                                            <ChevronRight className="ml-1" />
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-12 rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5">
                                        <Link href="#features">
                                            <span className="text-nowrap">See Examples</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="aspect-2/3 absolute inset-1 -z-10 overflow-hidden rounded-3xl border border-black/10 lg:aspect-video lg:rounded-[3rem] dark:border-white/5">
                            <video
                                 autoPlay
  muted
  loop
  playsInline
                                className="size-full object-cover opacity-50 invert dark:opacity-35 dark:invert-0 dark:lg:opacity-75"
                                src="/video.mp4"></video>
                        </div>
                    </div>
                </section>
                <section className="bg-background pb-2">
                    <div className="group relative m-auto max-w-7xl px-6">
                        {/* <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:pr-6">
                                <p className="text-end text-sm">Powered by AI technology</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    speedOnHover={20}
                                    speed={40}
                                    gap={112}>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                            alt="Nvidia Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/column.svg"
                                            alt="Column Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/github.svg"
                                            alt="GitHub Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/nike.svg"
                                            alt="Nike Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                            alt="Lemon Squeezy Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/laravel.svg"
                                            alt="Laravel Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-7 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/lilly.svg"
                                            alt="Lilly Logo"
                                            height="28"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-6 w-fit dark:invert"
                                            src="https://html.tailus.io/blocks/customers/openai.svg"
                                            alt="OpenAI Logo"
                                            height="24"
                                            width="auto"
                                        />
                                    </div>
                                </InfiniteSlider>

                                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div> */}
                    </div>
                </section>
                
                <section id="features" className="py-24 bg-background">
                    <div className="mx-auto max-w-7xl px-6 lg:px-12">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl mb-4">
                                Everything you need to build amazing projects
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                From simple landing pages to complex applications - generate them all with AI
                            </p>
                        </div>
                        
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Sparkles className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>AI-Powered Generation</CardTitle>
                                    <CardDescription>
                                        Advanced AI creates unique, professional websites based on your descriptions
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Zap className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>Lightning Fast</CardTitle>
                                    <CardDescription>
                                        Generate complete projects in seconds, not hours or days
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Code className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>Clean Code</CardTitle>
                                    <CardDescription>
                                        Get semantic HTML, modern CSS, and vanilla JavaScript that's easy to understand
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Globe className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>Responsive Design</CardTitle>
                                    <CardDescription>
                                        Every generated project works perfectly on desktop, tablet, and mobile
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Eye className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>Live Preview</CardTitle>
                                    <CardDescription>
                                        See your project come to life with our built-in preview system
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Download className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>One-Click Download</CardTitle>
                                    <CardDescription>
                                        Download your complete project as a ready-to-use HTML file
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>
                
                <section className="py-24 bg-gradient-to-r from-primary/5 to-primary/10">
                    <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center">
                        <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl mb-4">
                            Ready to start creating?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of developers and designers who are building faster with AI
                        </p>
                        <Button asChild size="lg" className="h-12 px-8">
                            <Link href="/dashboard">
                                <Sparkles className="mr-2 h-5 w-5" />
                                Start Generating Now
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>
        </>
    )
}
