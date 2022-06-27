declare module '*.teal' {
  const content: string;
  export default content;
}

declare module '*.cpp' {
  type Result = {
    exports: any;
    memory: any;
    memoryManager: any;
    raw: any;
  };
  type Init = (imports: any) => any;
  const init: (init?: Init) => Promise<Result>;
  export { init };
}
