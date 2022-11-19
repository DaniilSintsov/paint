interface IStorage {
  set: (key: string, value: any) => void
  get: (key: string) => any
}

export class Storage implements IStorage {
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  get(key: string): any {
    return JSON.parse(localStorage.getItem(key) as string)
  }
}
