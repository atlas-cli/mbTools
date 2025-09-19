export type ModuleId = 'style' | 'icons';

export interface UIMsg<T extends string = string, P = any> {
  module: ModuleId;
  type: T;
  payload?: P;
}

export interface UIPost {
  postMessage: (msg: any) => void;
}

export type Handler = (payload?: any) => Promise<void> | void;

export interface Module {
  id: ModuleId;
  name: string;
  init?: () => void; // opcional para registrar listeners (ex.: selectionchange)
  handlers: Record<string, Handler>;
}

