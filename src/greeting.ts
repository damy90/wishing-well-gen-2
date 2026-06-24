export function formatGreeting(template: string, name: string): string {
  return template.replace("{name}", name);
}
