
export var filterToMiddleware = filter =>
  (config, builder) =>
    builder(config).then(handler =>
      filter(config, handler))