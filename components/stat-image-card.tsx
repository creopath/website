"use client"

import Image from "next/image"
import { motion, type Variants } from "motion/react"

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function StatImageCard({ src, alt = "" }: { src?: string; alt?: string }) {
  return (
    <motion.div
      variants={item}
      className="h-full overflow-hidden rounded-2xl bg-brand-purple/10"
    >
      {src ? (
        <div className="relative h-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center bg-linear-to-br from-brand-purple/20 to-brand-deep-red/10">
          <div className="text-center">
            <div className="mx-auto size-16 rounded-full bg-brand-purple/15" />
            <p className="mt-3 text-xs text-muted-foreground">
              Image placeholder
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
