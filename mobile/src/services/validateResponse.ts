export function requireArray<T>(value: unknown, resource: string): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`Resposta inválida ao carregar ${resource}.`);
  }
  return value as T[];
}

export function requireObject<T extends object>(value: unknown, resource: string): T {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Resposta inválida ao carregar ${resource}.`);
  }
  return value as T;
}
