interface DockerConfig {
  name: string
  tags: string[]
}

export const AvailableDocker: DockerConfig[] = [
  {
    name: 'tzq0301/platform-example-app',
    tags: ['v1'],
  },
]
