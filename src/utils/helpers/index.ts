import container from '@app/inversify.config';

export function bindDependencies(func: any, dependencies: any) {
  const injections = dependencies.map((dependency: any) => {
    return container.get(dependency);
  });
  return func.bind(func, ...injections);
}
