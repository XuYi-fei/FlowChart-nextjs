import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-10 px-0 sm:px-6 xl:px-0 min-w-fit">{children}</section>
  )
}
