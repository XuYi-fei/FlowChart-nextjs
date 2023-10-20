interface DockerConfig {
  name: string
  version: string[]
}

export const AvailableDocker: DockerConfig[] = [
  {
    name: 'tzq0301/platform-example-app',
    version: ['v1'],
  },
]
