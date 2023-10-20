interface DockerConfig {
  name: string
  version: string[]
}

export const AvailableDocker: DockerConfig[] = [
  {
    name: 'tzq0301/platform-example-app',
    version: ['v1'],
  },
  {
    name: 'tzq0301/platform-example-pub',
    version: ['v1'],
  },
  {
    name: 'tzq0301/platform-example-sub',
    version: ['v1', 'v2'],
  },
]
