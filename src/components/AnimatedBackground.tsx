'use client'

import { useEffect, useRef } from 'react'

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      canvasWidth: number
      canvasHeight: number

      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.x = Math.random() * this.canvasWidth
        this.y = Math.random() * this.canvasHeight
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        this.opacity = Math.random() * 0.5 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > this.canvasWidth) this.x = 0
        if (this.x < 0) this.x = this.canvasWidth
        if (this.y > this.canvasHeight) this.y = 0
        if (this.y < 0) this.y = this.canvasHeight
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(147, 51, 234, ${this.opacity})` // Purple color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = 50
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height))
    }

    // Animation
    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Draw connections
      particles.forEach(particleA => {
        particles.forEach(particleB => {
          const dx = particleA.x - particleB.x
          const dy = particleA.y - particleB.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particleA.x, particleA.y)
            ctx.lineTo(particleB.x, particleB.y)
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-50 dark:opacity-20"
    />
  )
}

export default AnimatedBackground
