interface DockerConfig {
  name: string
  version: string[]
  port?: number
}

export const AvailableDocker: DockerConfig[] = [
  {
    name: 'tzq0301/platform-example-app',
    version: ['v1'],
  },
  {
    name: 'tzq0301/platform-example-pub',
    version: ['v1'],
    port: 8200,
  },
  {
    name: 'tzq0301/platform-example-sub',
    version: ['v1', 'v2'],
    port: 8201,
  },
]
