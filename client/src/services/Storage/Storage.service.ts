export class Storage {
  static set(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value))
  }

  static get(key: string): any {
    return JSON.parse(sessionStorage.getItem(key) as string)
  }
}
