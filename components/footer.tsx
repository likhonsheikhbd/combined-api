"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Send, Heart, Code, Zap } from "lucide-react"

export const Footer = React.memo(function Footer() {
  const currentYear = new Date().getFullYear()

  const handleTelegramClick = () => {
    window.open("https://t.me/likhonsheikh", "_blank", "noopener,noreferrer")
  }

  const handleGithubClick = () => {
    window.open("https://github.com/likhonsdev", "_blank", "noopener,noreferrer")
  }

  return (
    <footer className="mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Card className="border-0 rounded-none">
        <CardContent className="py-6">
          <div className="container mx-auto px-4">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Project Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Geploy AI</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A powerful, prompt-switchable chat interface powered by multiple AI models. Built with Next.js 14,
                  Tailwind CSS, and the Vercel AI SDK.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    Open Source
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500" />
                    Made with Love
                  </Badge>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-medium text-base">Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Multiple AI Models (Gemini, GPT, Claude)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Real-time Streaming Responses
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Prompt Switching & Customization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Performance Monitoring
                  </li>
                </ul>
              </div>

              {/* Developer Contact */}
              <div className="space-y-3">
                <h4 className="font-medium text-base">Connect with Developer</h4>
                <p className="text-sm text-muted-foreground">Get in touch for collaborations, feedback, or support.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTelegramClick}
                    className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950"
                  >
                    <Send className="w-4 h-4" />
                    Telegram
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGithubClick}
                    className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-200 dark:hover:bg-gray-950"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>© {currentYear} Geploy AI</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Built by Likhon Sheikh</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    Powered by
                    <Badge variant="secondary" className="ml-1">
                      Vercel AI SDK
                    </Badge>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  )
})
